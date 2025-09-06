"use strict";(()=>{var e={};e.id=2656,e.ids=[2656,628],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},629:e=>{e.exports=require("fs/promises")},5315:e=>{e.exports=require("path")},1764:e=>{e.exports=require("util")},4008:(e,t,s)=>{s.r(t),s.d(t,{originalPathname:()=>h,patchFetch:()=>f,requestAsyncStorage:()=>x,routeModule:()=>d,serverHooks:()=>g,staticGenerationAsyncStorage:()=>y});var r={};s.r(r),s.d(r,{POST:()=>m});var i=s(9303),n=s(8716),o=s(670),a=s(629),c=s(5315),l=s(7536);s(3442),s(628);class u{constructor(e,t){this.groqClient=e,this.memory=t,this.logger=new l.Z("ReactGenerator"),this.templates={component:{functional:"functional-component.template",class:"class-component.template",hook:"custom-hook.template"},styles:{css:"component.css.template",scss:"component.scss.template",styled:"styled-component.template",tailwind:"tailwind-component.template"}},this.defaultConfig={typescript:!1,storybook:!0,tests:!0,styling:"tailwind",hooks:!0,proptypes:!1,accessibility:!0,responsive:!0}}async generateComponent(e,t={}){try{let s={...this.defaultConfig,...t};this.logger.info(`⚛️ G\xe9n\xe9ration du composant React: ${e.name}`);let r=await this.analyzeComponentSpec(e,s),i=await this.findSimilarComponents(e),n=await this.generateComponentCode(e,r,s),o=await this.validator.validateCode(n),a=await this.formatter.formatCode(n),c=a.success?a.code:n,l=await this.generateAssociatedFiles(e,c,s);await this.saveToMemory(e,c,r,o);let u={success:!0,component:{name:e.name,code:c,files:l,validation:o,analysis:r},metadata:{timestamp:Date.now(),config:s,similarComponents:i.length}};return this.logger.info(`✅ Composant ${e.name} g\xe9n\xe9r\xe9 avec succ\xe8s`),u}catch(t){return this.logger.error(`❌ Erreur g\xe9n\xe9ration composant ${e.name}:`,t),{success:!1,error:t.message,component:null}}}async generateHook(e,t={}){try{let s={...this.defaultConfig,...t};this.logger.info(`🪝 G\xe9n\xe9ration du hook: ${e.name}`);let r=await this.analyzeHookSpec(e,s),i=await this.generateHookCode(e,r,s),n=await this.validator.validateCode(i),o=await this.formatter.formatCode(i),a=o.success?o.code:i,c=s.tests?await this.generateHookTests(e,a):null;return await this.saveToMemory(e,a,r,n),{success:!0,hook:{name:e.name,code:a,tests:c,validation:n,analysis:r},metadata:{timestamp:Date.now(),config:s}}}catch(t){return this.logger.error(`❌ Erreur g\xe9n\xe9ration hook ${e.name}:`,t),{success:!1,error:t.message}}}async generateContext(e,t={}){try{let s={...this.defaultConfig,...t};this.logger.info(`🌐 G\xe9n\xe9ration du contexte: ${e.name}`);let r=await this.analyzeContextSpec(e,s),i=await this.generateContextCode(e,r,s),n=await this.generateProviderCode(e,r,s),o=await this.generateContextHookCode(e,r,s),a=await this.validator.validateCode(i),c=await this.formatter.formatCode(i),l=await this.formatter.formatCode(n),u=await this.formatter.formatCode(o),p=c.success?c.code:i,m=l.success?l.code:n,d=u.success?u.code:o;return{success:!0,context:{name:e.name,context:p,provider:m,hook:d,validation:a,analysis:r},metadata:{timestamp:Date.now(),config:s}}}catch(t){return this.logger.error(`❌ Erreur g\xe9n\xe9ration contexte ${e.name}:`,t),{success:!1,error:t.message}}}async analyzeComponentSpec(e,t){let s=`
Analyse cette sp\xe9cification de composant React et fournis des insights:

Sp\xe9cification:
${JSON.stringify(e,null,2)}

Configuration:
${JSON.stringify(t,null,2)}

Analyse et retourne:
- Type de composant recommand\xe9 (functional, class)
- Props n\xe9cessaires avec leurs types
- \xc9tat local requis
- Hooks \xe0 utiliser
- Patterns React applicables
- Consid\xe9rations d'accessibilit\xe9
- Optimisations possibles
- Complexit\xe9 estim\xe9e (1-10)

Format: JSON structur\xe9
`;return await this.groqClient.analyzeContext({prompt:s})}async analyzeHookSpec(e,t){let s=`
Analyse cette sp\xe9cification de hook React personnalis\xe9:

Sp\xe9cification:
${JSON.stringify(e,null,2)}

Analyse et retourne:
- Param\xe8tres d'entr\xe9e
- Valeurs de retour
- Hooks React \xe0 utiliser
- Gestion des effets de bord
- Optimisations (useMemo, useCallback)
- Cas d'usage typiques
- Complexit\xe9 estim\xe9e

Format: JSON structur\xe9
`;return await this.groqClient.analyzeContext({prompt:s})}async analyzeContextSpec(e,t){let s=`
Analyse cette sp\xe9cification de contexte React:

Sp\xe9cification:
${JSON.stringify(e,null,2)}

Analyse et retourne:
- Structure de l'\xe9tat global
- Actions disponibles
- M\xe9thodes de mise \xe0 jour
- Optimisations de performance
- Patterns de consommation
- Gestion des erreurs

Format: JSON structur\xe9
`;return await this.groqClient.analyzeContext({prompt:s})}async generateComponentCode(e,t,s){let r=`
G\xe9n\xe8re un composant React moderne et optimis\xe9:

Nom: ${e.name}
Description: ${e.description||"Composant React"}
Type: ${t.componentType||"functional"}

Sp\xe9cifications:
${JSON.stringify(e,null,2)}

Analyse IA:
${JSON.stringify(t,null,2)}

Configuration:
- TypeScript: ${s.typescript}
- Styling: ${s.styling}
- Accessibilit\xe9: ${s.accessibility}
- Responsive: ${s.responsive}

G\xe9n\xe8re un composant qui:
1. Utilise les hooks modernes appropri\xe9s
2. Respecte les bonnes pratiques React
3. Inclut la gestion d'erreurs
4. Est optimis\xe9 pour les performances
5. Respecte l'accessibilit\xe9
6. Est responsive si demand\xe9
7. Inclut PropTypes ou TypeScript selon config
8. Utilise le syst\xe8me de styling configur\xe9

Retourne uniquement le code du composant.
`;return(await this.groqClient.generateCode({type:"component",name:e.name,prompt:r},{temperature:.7,maxTokens:2048})).code}async generateHookCode(e,t,s){let r=`
G\xe9n\xe8re un hook React personnalis\xe9:

Nom: ${e.name}
Description: ${e.description||"Hook personnalis\xe9"}

Sp\xe9cifications:
${JSON.stringify(e,null,2)}

Analyse IA:
${JSON.stringify(t,null,2)}

Le hook doit:
1. Commencer par "use" (convention React)
2. G\xe9rer les effets de bord appropri\xe9s
3. Inclure le nettoyage n\xe9cessaire
4. \xcatre optimis\xe9 avec useMemo/useCallback si n\xe9cessaire
5. Retourner une interface claire
6. G\xe9rer les cas d'erreur
7. \xcatre r\xe9utilisable

TypeScript: ${s.typescript}

Retourne uniquement le code du hook.
`;return(await this.groqClient.generateCode({type:"hook",name:e.name,prompt:r})).code}async generateContextCode(e,t,s){let r=`
G\xe9n\xe8re un contexte React avec son \xe9tat et ses types:

Nom: ${e.name}Context
Description: ${e.description||"Contexte React"}

Sp\xe9cifications:
${JSON.stringify(e,null,2)}

Analyse:
${JSON.stringify(t,null,2)}

G\xe9n\xe8re:
1. Interface TypeScript pour l'\xe9tat (si TypeScript activ\xe9)
2. Interface pour les actions
3. Cr\xe9ation du contexte avec createContext
4. Valeurs par d\xe9faut appropri\xe9es
5. Types d'export

TypeScript: ${s.typescript}

Retourne uniquement le code du contexte.
`;return(await this.groqClient.generateCode({type:"context",name:e.name,prompt:r})).code}async generateProviderCode(e,t,s){let r=`
G\xe9n\xe8re un Provider React pour le contexte ${e.name}:

Sp\xe9cifications:
${JSON.stringify(e,null,2)}

Le Provider doit:
1. G\xe9rer l'\xe9tat avec useReducer ou useState
2. Impl\xe9menter les actions d\xe9finies
3. Optimiser les re-renders avec useMemo
4. G\xe9rer les erreurs
5. Fournir une interface claire

TypeScript: ${s.typescript}

Retourne uniquement le code du Provider.
`;return(await this.groqClient.generateCode({type:"provider",name:`${e.name}Provider`,prompt:r})).code}async generateContextHookCode(e,t,s){let r=`
G\xe9n\xe8re un hook pour utiliser le contexte ${e.name}:

Le hook doit:
1. S'appeler use${e.name}
2. Utiliser useContext
3. V\xe9rifier que le contexte est utilis\xe9 dans un Provider
4. Retourner l'\xe9tat et les actions
5. Inclure la gestion d'erreurs

TypeScript: ${s.typescript}

Retourne uniquement le code du hook.
`;return(await this.groqClient.generateCode({type:"context-hook",name:`use${e.name}`,prompt:r})).code}async generateAssociatedFiles(e,t,s){let r={};return"styled"!==s.styling&&"tailwind"!==s.styling&&(r.styles=await this.generateStylesFile(e,s)),s.typescript&&(r.types=await this.generateTypesFile(e,t)),r.index=await this.generateIndexFile(e),r}async generateStylesFile(e,t){let s="scss"===t.styling?"scss":"css",r=`
G\xe9n\xe8re un fichier de styles ${s.toUpperCase()} pour le composant ${e.name}:

Le fichier doit inclure:
1. Styles de base du composant
2. Styles responsive si demand\xe9
3. Variables CSS personnalis\xe9es
4. Animations/transitions appropri\xe9es
5. Respect des bonnes pratiques CSS

Format: ${s.toUpperCase()}
Responsive: ${t.responsive}

Retourne uniquement le code CSS/SCSS.
`,i=await this.groqClient.generateCode({type:"styles",name:`${e.name}.${s}`,prompt:r});return{filename:`${e.name}.${s}`,content:i.code}}async generateTypesFile(e,t){let s=`
G\xe9n\xe8re un fichier de types TypeScript pour le composant ${e.name}:

Code du composant:
${t}

G\xe9n\xe8re:
1. Interface pour les props
2. Types pour l'\xe9tat local si applicable
3. Types pour les callbacks
4. Types utilitaires si n\xe9cessaire
5. Exports appropri\xe9s

Retourne uniquement les d\xe9finitions de types.
`,r=await this.groqClient.generateCode({type:"types",name:`${e.name}.types.ts`,prompt:s});return{filename:`${e.name}.types.ts`,content:r.code}}async generateIndexFile(e){return{filename:"index.js",content:`export { default } from './${e.name}';
export * from './${e.name}';
`}}async generateHookTests(e,t){let s=`
G\xe9n\xe8re des tests Jest + React Testing Library pour ce hook:

Code du hook:
${t}

Les tests doivent couvrir:
1. Comportement initial
2. Mise \xe0 jour de l'\xe9tat
3. Effets de bord
4. Nettoyage
5. Cas d'erreur
6. Cas limites

Utilise @testing-library/react-hooks pour les tests de hooks.

Retourne uniquement le code des tests.
`;return(await this.groqClient.generateCode({type:"test",name:`${e.name}.test.js`,prompt:s})).code}async findSimilarComponents(e){return this.memory.isInitialized?await this.memory.findSimilar({type:"component",name:e.name,description:e.description,domain:"react"}):[]}async saveToMemory(e,t,s,r){this.memory.isInitialized&&await this.memory.recordGeneration({type:"component",name:e.name,code:t,analysis:s,validation:r,domain:"react",timestamp:Date.now(),success:r.isValid,quality:r.score/100})}async writeFiles(e,t){try{let s=c.join(t,e.component.name);await a.mkdir(s,{recursive:!0});let r=e.component.name+".jsx";for(let[t,i]of(await a.writeFile(c.join(s,r),e.component.code),Object.entries(e.component.files)))i&&i.content&&await a.writeFile(c.join(s,i.filename),i.content);return this.logger.info(`📁 Fichiers \xe9crits dans: ${s}`),{success:!0,path:s,files:[r,...Object.values(e.component.files).map(e=>e.filename)]}}catch(e){return this.logger.error("❌ Erreur \xe9criture fichiers:",e),{success:!1,error:e.message}}}async getStats(){if(!this.memory.isInitialized)return{components:0,hooks:0,contexts:0};await this.memory.getStats();let e=await this.memory.search("",{type:"generation",tags:["react"]});return{totalGenerations:e.length,components:e.filter(e=>"component"===e.data.type).length,hooks:e.filter(e=>"hook"===e.data.type).length,contexts:e.filter(e=>"context"===e.data.type).length,averageQuality:e.reduce((e,t)=>e+(t.data.quality||0),0)/e.length||0}}}var p=s(2537);async function m(e){try{let{prompt:t,config:s}=await e.json(),r=new u,i=await r.generateComponent({name:"GeneratedComponent",description:t,type:"functional"},s);return i.success&&i.component?.code&&(0,p.Hb)({prompt:t,code:i.component.code,title:`Composant g\xe9n\xe9r\xe9 - ${new Date().toLocaleDateString()}`}),Response.json({code:i.component?.code||"// Erreur de g\xe9n\xe9ration",success:i.success})}catch(e){return console.error("[API Error]",e),new Response(JSON.stringify({error:"Erreur g\xe9n\xe9ration",details:e.message}),{status:500})}}let d=new i.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/generate/react/route",pathname:"/api/generate/react",filename:"route",bundlePath:"app/api/generate/react/route"},resolvedPagePath:"C:\\Users\\guima\\Desktop\\Dashboard IA Project\\jarvis-workstation\\app\\api\\generate\\react\\route.js",nextConfigOutput:"",userland:r}),{requestAsyncStorage:x,staticGenerationAsyncStorage:y,serverHooks:g}=d,h="/api/generate/react/route";function f(){return(0,o.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:y})}},2537:(e,t,s)=>{s.d(t,{Lz:()=>n,Hb:()=>i}),s(629),s(5315),s(7702);let r=[];function i({prompt:e,code:t,title:s}){let i=new Date().toISOString();r.unshift({prompt:e,code:t,title:s,date:i})}function n(){return r}},628:(e,t,s)=>{s.r(t),s.d(t,{default:()=>o});var r=s(8631),i=s(629);s(5315);class n{constructor(){this.rules={complexity:{maxCyclomatic:10,maxLines:100,maxDepth:4},security:{disallowedPatterns:[/eval\(/,/Function\(/,/\.innerHTML\s*=/,/\.outerHTML\s*=/,/document\.write/,/setTimeout\(.*\)/,/setInterval\(.*\)/]},quality:{requireComments:!0,minCommentRatio:.1,disallowedPatterns:[/console\.log/,/debugger/,/alert\(/]}}}validateSyntax(e,t="unknown.js"){try{let t=(0,r.Qc)(e,{sourceType:"module",plugins:["typescript","jsx","decorators","classProperties"],allowAwaitOutsideFunction:!0,allowReturnOutsideFunction:!0});return{valid:!0,ast:t,errors:[]}}catch(e){return{valid:!1,errors:[{line:e.loc?.line,column:e.loc?.column,message:e.message,severity:"error"}]}}}analyzeComplexity(e){let t=e.split("\n"),s=[],r=this.calculateCyclomaticComplexity(e);r>this.rules.complexity.maxCyclomatic&&s.push({type:"complexity",message:`Complexit\xe9 cyclomatique \xe9lev\xe9e: ${r} (max: ${this.rules.complexity.maxCyclomatic})`,severity:"warning"}),t.length>this.rules.complexity.maxLines&&s.push({type:"size",message:`Fichier trop long: ${t.length} lignes (max: ${this.rules.complexity.maxLines})`,severity:"warning"});let i=this.calculateNestedDepth(e);return i>this.rules.complexity.maxDepth&&s.push({type:"nesting",message:`Nesting trop profond: ${i} niveaux (max: ${this.rules.complexity.maxDepth})`,severity:"warning"}),{score:Math.max(0,100-(2*r+5*i)),issues:s,metrics:{lines:t.length,cyclomaticComplexity:r,nestedDepth:i}}}calculateCyclomaticComplexity(e){let t=1;return[/if\s*\(/g,/else\s*if\s*\(/g,/for\s*\(/g,/while\s*\(/g,/case\s*:/g,/catch\s*\(/g,/\?\s*.*\s*:/g,/&&/g,/\|\|/g].forEach(s=>{let r=e.match(s);r&&(t+=r.length)}),t}calculateNestedDepth(e){let t=0,s=0,r=[];for(let i of e.split(/([{}()\[\]])/))["{","(","["].includes(i)?(r.push(i),t=Math.max(t,++s)):["}",")","]"].includes(i)&&r.length>0&&(r.pop(),s--);return t}checkSecurity(e){let t=[];return this.rules.security.disallowedPatterns.forEach((s,r)=>{e.match(s)&&t.push({type:"security",message:`Pattern de s\xe9curit\xe9 d\xe9tect\xe9: ${s.toString()}`,severity:"high",pattern:s.toString()})}),t}checkQuality(e){let t=[],s=e.split("\n"),r=s.filter(e=>e.trim().startsWith("//")||e.trim().startsWith("/*")||e.trim().includes("/**")).length,i=r/s.length;return i<this.rules.quality.minCommentRatio&&t.push({type:"documentation",message:`Ratio de commentaires faible: ${(100*i).toFixed(1)}% (min: ${100*this.rules.quality.minCommentRatio}%)`,severity:"info"}),this.rules.quality.disallowedPatterns.forEach(s=>{e.match(s)&&t.push({type:"quality",message:`Pattern de d\xe9veloppement d\xe9tect\xe9: ${s.toString()}`,severity:"low",pattern:s.toString()})}),{issues:t,metrics:{totalLines:s.length,commentLines:r,commentRatio:i}}}async validateCode(e,t={}){let s=this.validateSyntax(e);if(!s.valid)return{valid:!1,severity:"error",issues:s.errors,metrics:null};let r=this.analyzeComplexity(e),i=this.checkSecurity(e),n=this.checkQuality(e),o=[...r.issues,...i,...n.issues],a=o.some(e=>"error"===e.severity),c=o.some(e=>"warning"===e.severity);return{valid:!a,severity:a?"error":c?"warning":"info",issues:o,metrics:{...r.metrics,...n.metrics,complexityScore:r.score},suggestions:this.generateSuggestions(o)}}generateSuggestions(e){return e.map(e=>{switch(e.type){case"complexity":return"Consid\xe9rez de diviser cette fonction en plusieurs fonctions plus petites";case"security":return"\xc9vitez les patterns potentiellement dangereux pour la s\xe9curit\xe9";case"documentation":return"Ajoutez plus de commentaires pour am\xe9liorer la maintenabilit\xe9";default:return"Revoyez cette partie du code pour l'am\xe9liorer"}})}async validateFile(e){try{let t=await (0,i.readFile)(e,"utf8");return await this.validateCode(t,{filepath:e})}catch(e){return{valid:!1,severity:"error",issues:[{message:`Impossible de lire le fichier: ${e.message}`,severity:"error"}],metrics:null}}}}let o=n}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[8948,8631,5180],()=>s(4008));module.exports=r})();