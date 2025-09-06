<# 
  collect-project-info.ps1
  Produit project-info.zip avec une vue d’ensemble du repo SANS secrets.
#>

param(
  [string]$OutDir = "project-info"
)

$ErrorActionPreference = "Stop"
$root = Get-Location
$out = Join-Path $root $OutDir
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Path $out | Out-Null

function Save-IfExists([string]$path, [string]$destName = $null) {
  if (Test-Path $path) {
    $dest = $(if ($destName) { Join-Path $out $destName } else { Join-Path $out (Split-Path $path -Leaf) })
    Copy-Item $path $dest -Recurse -Force
  }
}

# ----- Résumé rapide
$summary = @()
$summary += "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss K')"
$summary += "Root: $root"
$summary += "Node: $(node -v 2>$null)"
$summary += "NPM:  $(npm -v 2>$null)"
$summary += ""
"=== SUMMARY ===`r`n$($summary -join "`r`n")" | Out-File -FilePath (Join-Path $out "summary.txt") -Encoding UTF8

# ----- Structure (arbo courte)
Get-ChildItem -Recurse -Depth 3 -ErrorAction SilentlyContinue `
  | Where-Object { $_.FullName -notmatch "\\node_modules\\|\\\.next\\|\\dist\\|\\build\\|\\coverage\\|\\\.git\\" } `
  | Select-Object FullName, Length, LastWriteTime `
  | Sort-Object FullName `
  | Format-Table -AutoSize `
  | Out-String `
  | Out-File -FilePath (Join-Path $out "tree-depth3.txt") -Encoding UTF8

# ----- Copie fichiers de config utiles
$maybeConfigs = @(
  "package.json","package-lock.json","yarn.lock","pnpm-lock.yaml",
  "next.config.js","next.config.mjs",
  "tsconfig.json","jsconfig.json",
  "tailwind.config.js","postcss.config.js",
  ".eslintrc",".eslintrc.js",".eslintrc.cjs",".eslintrc.json",
  ".prettierrc",".prettierrc.json",".prettierrc.js",
  ".gitignore",".npmrc"
)
$maybeConfigs | ForEach-Object { Save-IfExists $_ }

# ----- Liste des pages (App Router)
if (Test-Path "app") {
  Get-ChildItem "app" -Recurse -Depth 3 | Select-Object FullName | Sort-Object FullName `
    | Out-File -FilePath (Join-Path $out "app-structure.txt") -Encoding UTF8
}
if (Test-Path "src/app") {
  Get-ChildItem "src/app" -Recurse -Depth 3 | Select-Object FullName | Sort-Object FullName `
    | Out-File -FilePath (Join-Path $out "src-app-structure.txt") -Encoding UTF8
}

# ----- Dépendances
try {
  npm list --depth=0 | Out-File -FilePath (Join-Path $out "npm-list.txt") -Encoding UTF8
  npm list --depth=0 --json | Out-File -FilePath (Join-Path $out "npm-list.json") -Encoding UTF8
} catch {
  "Impossible d’exécuter 'npm list' : $($_.Exception.Message)" | Out-File (Join-Path $out "npm-list.txt")
}

# ----- Vérification des dépendances 3D
$depsReport = @()
try {
  $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
  $deps = @{}
  if ($packageJson.dependencies) { $deps += $packageJson.dependencies }
  if ($packageJson.devDependencies) { $deps += $packageJson.devDependencies }

  $required3D = @("three","@react-three/fiber","@react-three/drei","react-force-graph-2d","react-force-graph-3d")
  foreach ($dep in $required3D) {
    if ($deps[$dep]) {
      $depsReport += "✅ $dep: $($deps[$dep])"
    } else {
      $depsReport += "❌ $dep: MANQUANT"
    }
  }
} catch {
  $depsReport += "Erreur lors de la lecture de package.json: $($_.Exception.Message)"
}
$depsReport | Out-File -FilePath (Join-Path $out "3d-dependencies.txt") -Encoding UTF8

# ----- Infos Git
$gitInfo = Join-Path $out "git-info.txt"
try {
  if ((git rev-parse --is-inside-work-tree) -eq "true") {
    $git = @()
    $git += "Branch: $(git rev-parse --abbrev-ref HEAD 2>$null)"
    $git += ""
    $git += "== Remote =="
    $git += (git remote -v 2>$null)
    $git += ""
    $git += "== Status =="
    $git += (git status -sb 2>$null)
    $git += ""
    $git += "== Derniers commits (30) =="
    $git += (git log --oneline -n 30 2>$null)
    $git += ""
    $git += "== Fichiers en conflit éventuels =="
    $git += (git diff --name-only --diff-filter=U 2>$null)
    $git -join "`r`n" | Out-File -FilePath $gitInfo -Encoding UTF8
  }
} catch {
  "Git non dispo ou pas un repo : $($_.Exception.Message)" | Out-File -FilePath $gitInfo -Encoding UTF8
}

# ----- Ne PAS inclure .env ; seulement liste des noms
Get-ChildItem -Name ".env*" -ErrorAction SilentlyContinue `
  | Out-File -FilePath (Join-Path $out "env-files-present.txt") -Encoding UTF8

# ----- Zippage final
$zip = Join-Path $root "project-info.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $out "*") -DestinationPath $zip -Force

Write-Host ""
Write-Host "✅ Fini. Archive générée : $zip"
