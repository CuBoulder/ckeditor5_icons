!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.CKEditor5=t():(e.CKEditor5=e.CKEditor5||{},e.CKEditor5.icon=t())}(self,(()=>(()=>{var e=[(e,t,i)=>{e.exports=i(3)("./src/ui.js")},(e,t,i)=>{e.exports=i(3)("./src/core.js")},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.faStyleClassByVersion=t.faStyleLabels=t.alignmentDefault=t.alignmentOptions=t.sizeDefault=t.sizeOptions=void 0;const s=i(1);t.sizeOptions={extraSmall:{label:"Extra Small",icon:s.icons.objectSizeSmall,className:"fa-xs"},small:{label:"Small",icon:s.icons.objectSizeSmall,className:"fa-sm"},regular:{label:"Regular",icon:s.icons.objectSizeMedium},large:{label:"Large",icon:s.icons.objectSizeLarge,className:"fa-lg"},extraLarge:{label:"Extra Large",icon:s.icons.objectSizeFull,className:"fa-xl"},"2x":{label:"2x",className:"fa-2x"},"3x":{label:"3x",className:"fa-3x"},"4x":{label:"4x",className:"fa-4x"},"5x":{label:"5x",className:"fa-5x"},"6x":{label:"6x",className:"fa-6x"},"7x":{label:"7x",className:"fa-7x"},"8x":{label:"8x",className:"fa-8x"},"9x":{label:"9x",className:"fa-9x"},"10x":{label:"10x",className:"fa-10x"}},t.sizeDefault="regular",t.alignmentOptions={none:{label:"With text",icon:s.icons.objectCenter},left:{label:"Pull left",icon:s.icons.objectLeft,className:"fa-pull-left"},right:{label:"Pull right",icon:s.icons.objectRight,className:"fa-pull-right"}},t.alignmentDefault="none",t.faStyleLabels={solid:"Solid",regular:"Regular",light:"Light",thin:"Thin",duotone:"Duotone",brands:"Brands"},t.faStyleClassByVersion={6:{solid:"fa-solid",regular:"fa-regular",light:"fa-light",thin:"fa-thin",duotone:"fa-duotone",brands:"fa-brands"},5:{solid:"fas",regular:"far",light:"fal",duotone:"fad",brands:"fab"}}},e=>{"use strict";e.exports=CKEditor5.dll},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getFAStyleClass=t.getValidIconStyle=t.getSelectedIconWidget=void 0;const s=i(2);t.getSelectedIconWidget=function(e){const t=e.getSelectedElement();return t&&t.is("element")&&"icon"===t.name?t:null},t.getValidIconStyle=function(e,t){const i=e.styles;let s=0;if(t){const e=i.indexOf(t);-1!==e&&(s=e)}return i[s]},t.getFAStyleClass=function(e,t){return s.faStyleClassByVersion[e][t]||"fas"}},(e,t,i)=>{e.exports=i(3)("./src/utils.js")},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=s(i(7));t.default={Icon:o.default}},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(1),n=s(i(8)),r=s(i(9)),c=s(i(23));class a extends o.Plugin{static get requires(){return[n.default,r.default,c.default]}}t.default=a},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(1),n=i(14),r=s(i(16)),c=s(i(17)),a=i(2);class l extends o.Plugin{static get requires(){return[n.Widget]}init(){this._defineSchema(),this._defineConverters(),this._defineCommands()}_defineSchema(){this.editor.model.schema.register("icon",{isObject:!0,isInline:!0,allowWhere:"$text",allowAttributes:["iconClass","iconSize","iconAlignment"]})}_defineConverters(){const{conversion:e}=this.editor;e.for("upcast").attributeToAttribute({model:{key:"iconClass",value:e=>{if(!e.hasAttribute("class"))return"";const t=e.getAttribute("class").match(/(fa-([a-z0-9\-]+)|fas|far|fal|fad|fab)/g);let i="";if(t)for(const e of t)e.match(/fa-(2xs|xs|sm|lg|xl|2xl|([0-9]|10)x)/)||e.match(/fa-(pull-left|pull-right)/)||(i=i?i+" "+e:e);return i}},view:"class"}),e.attributeToAttribute(d("iconSize",a.sizeOptions)),e.attributeToAttribute(d("iconAlignment",a.alignmentOptions)),e.for("upcast").elementToElement({model:"icon",view:{name:"i",classes:/(fa-(solid|regular|light|thin|duotone|brands))|fas|far|fal|fad|fab/}}),e.for("dataDowncast").elementToElement({model:"icon",view:(e,{writer:t})=>function(e,t){const i=e.getAttribute("iconClass");return t.createContainerElement("i",{class:i})}(e,t)}),e.for("editingDowncast").elementToElement({model:"icon",view:(e,{writer:t})=>function(e,t){const i=e.getAttribute("iconClass");return(0,n.toWidget)(t.createContainerElement("span",{class:"ckeditor5-icons__widget"},[t.createRawElement("span",{},(e=>e.innerHTML='<i class="'+i+'"></i>'))]),t,{label:"icon widget"})}(e,t)})}_defineCommands(){const e=this.editor,t=e.commands;t.add("insertIcon",new r.default(e)),t.add("sizeIcon",new c.default(e,"iconSize",a.sizeDefault)),t.add("alignIcon",new c.default(e,"iconAlignment",a.alignmentDefault))}}function d(e,t){const i={},s=[];for(const[e,o]of Object.entries(t))o.className&&(s.push(e),i[e]={key:"class",value:o.className});return{model:{key:e,values:s},view:i}}t.default=l},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(1),n=i(0),r=s(i(18)),c=s(i(10)),a=i(4),l=i(2);class d extends o.Plugin{init(){const{commands:e,config:t,ui:i}=this.editor,s=e.get("insertIcon"),o=i.componentFactory,d=t.get("icon.faVersion")||"6",u=t.get("icon.faCategories")||{},h=t.get("icon.faIcons")||{},f=t.get("icon.recommendedIcons"),m=Object.keys(l.faStyleLabels);o.add("icon",(e=>{const t=(0,n.createDropdown)(e);let i;return t.buttonView.set({label:e.t("Icons"),icon:r.default,tooltip:!0}),t.bind("isEnabled").to(s,"isEnabled"),t.on("change:isOpen",(()=>{i?!t.isOpen&&i.iconName&&i.fire("cancel"):(i=new c.default(e,d,u,h,m,f),this.listenTo(i,"execute",((e,t,i)=>{s.execute({iconClass:(0,a.getFAStyleClass)(d,i)+" fa-"+t})})),t.panelView.children.add(i))})),t}))}}t.default=d},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(0),n=i(5),r=i(4),c=s(i(19)),a=s(i(11)),l=s(i(13));class d extends o.View{constructor(e,t,i,s,d,u){super(e),this.set("iconName",null),this.set("iconStyle",null),this.set("iconDefinition",null),this.headerView=new c.default(e,i,d,u),this.gridView=new a.default(e,t),this.footerView=new l.default(e,t),this.searchFieldView=this.footerView.searchView.searchFieldView.fieldView,this.items=this.createCollection(),this.focusTracker=new n.FocusTracker,this.keystrokes=new n.KeystrokeHandler,new o.FocusCycler({focusables:this.items,focusTracker:this.focusTracker,keystrokeHandler:this.keystrokes,actions:{focusPrevious:"shift + tab",focusNext:"tab"}}),this.setTemplate({tag:"div",children:[this.headerView,this.gridView,this.footerView],attributes:{tabindex:"-1"}}),this.items.add(this.headerView),this.items.add(this.gridView),this.listenTo(this.headerView,"execute",((e,t,i)=>{this.set("iconName",null),this.set("iconDefinition",null),this.gridView.refresh(t,i,s),this.footerView.refresh(),this._stopTrackingFooterForm()})),this.listenTo(this.gridView,"execute",((e,t,i)=>{this.set("iconName",t),this.set("iconStyle",(0,r.getValidIconStyle)(i,this.iconStyle)),this.set("iconDefinition",i),this.footerView.refresh(),this._startTrackingFooterForm()})),this.listenTo(this.gridView,"gridSectionLoad",((e,t)=>{t?this._startTracking(this.gridView.expandButtonView,this.items.getIndex(this.searchFieldView)):this._stopTracking(this.gridView.expandButtonView)})),this.listenTo(this.footerView,"search",((e,t)=>{this.iconName&&(this.set("iconName",null),this.set("iconDefinition",null),this.footerView.refresh(),this._stopTrackingFooterForm()),t?(this.gridView.refresh("_all",i._all,s,t),this.headerView.categoryDropdownView.buttonView.set("isVisible",!1)):(this.gridView.refresh(this.headerView.categoryName||"_all",this.headerView.categoryDefinition||i._all,s),this.headerView.categoryDropdownView.buttonView.set("isVisible",!0))})),this.listenTo(this.footerView,"changeStyle",((e,t)=>{this.set("iconStyle",t),this.footerView.refresh()})),this.on("cancel",(e=>this._clearSelectedIcon(!0))),this.keystrokes.set("Esc",((e,t)=>{this.iconName&&(this.fire("cancel"),t())})),this.gridView.bind("iconName","iconStyle").to(this),this.footerView.bind("iconName","iconStyle","iconDefinition").to(this),this.footerView.on("execute",(()=>{this.fire("execute",this.iconName,this.iconStyle),this._clearSelectedIcon()})),this.footerView.delegate("cancel").to(this),i._recommended?this.headerView.fire("execute","_recommended",i._recommended):this.headerView.fire("execute","_all",i._all)}_startTracking(e,t){this.items.has(e)||(this.items.add(e,t),this.focusTracker.add(e.element))}_stopTracking(e){this.items.has(e)&&(this.items.remove(e),this.focusTracker.remove(e.element))}_startTrackingFooterForm(){this._stopTracking(this.searchFieldView),this._startTracking(this.footerView.formView.styleDropdownView.buttonView),this._startTracking(this.footerView.formView.submitButtonView),this._startTracking(this.footerView.formView.cancelButtonView)}_stopTrackingFooterForm(){this._stopTracking(this.footerView.formView.styleDropdownView.buttonView),this._stopTracking(this.footerView.formView.submitButtonView),this._stopTracking(this.footerView.formView.cancelButtonView),this._startTracking(this.searchFieldView)}_clearSelectedIcon(e=!1){var t;e&&this.focusTracker.isFocused&&(null===(t=this.focusTracker.focusedElement)||void 0===t?void 0:t.parentElement)===this.footerView.formView.element&&this.gridView.focus(),this.set("iconName",null),this.set("iconDefinition",null),this.footerView.refresh(),this._stopTrackingFooterForm()}render(){super.render(),this.focusTracker.add(this.headerView.element),this.focusTracker.add(this.gridView.element),this.keystrokes.listenTo(this.element)}destroy(){super.destroy(),this.focusTracker.destroy(),this.keystrokes.destroy()}focus(){this.items.has(this.searchFieldView)?this.searchFieldView.focus():this.headerView.focus()}}t.default=d},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(5),n=i(0),r=s(i(20)),c=s(i(12)),a=i(0),l=i(1);class d extends n.View{constructor(e,t){super(e),this.faVersion=t;const s=e.t;this.items=this.createCollection(),this.sections=this.createCollection(),this.itemsView=new n.View,this.itemsView.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__grid-section"]}}),this.expandButtonView=new a.ButtonView(e),this.expandButtonView.set({icon:l.icons.plus,label:s("Show More"),withText:!0,isVisible:!1,class:"ckeditor5-icons__grid-expand"}),this.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__grid"]},children:[this.itemsView,{tag:"div",attributes:{class:["ck","ckeditor5-icons__grid-options",this.expandButtonView.bindTemplate.to("isVisible",(e=>e?"":"ck-hidden"))]},children:[this.expandButtonView]}]}),this.focusTracker=new o.FocusTracker,this.keystrokes=new o.KeystrokeHandler,(0,r.default)({keystrokeHandler:this.keystrokes,focusTracker:this.focusTracker,gridItems:this.items,numberOfColumns:()=>i.g.window.getComputedStyle(this.itemsView.element.firstChild).getPropertyValue("grid-template-columns").split(" ").length,uiLanguageDirection:e.uiLanguageDirection})}_createItem(e,t){const i=new c.default(this.locale,this.faVersion,e,t);return i.on("mouseover",(()=>this.fire("itemHover",e,t))),i.on("focus",(()=>this.fire("itemFocus",e,t))),i.on("execute",(()=>this.fire("execute",e,t))),i.bind("isOn").to(this,"iconName",(t=>e===t)),i}refresh(e,t,i,s){let o;this.items.clear(),this.itemsView.deregisterChild(this.sections),this.itemsView.element.innerText="",this.sections.clear(),o="_all"===e?Object.keys(i):"_brands"===e?Object.keys(i).filter((e=>i[e].styles.includes("brands"))):t.icons,s&&(o=function(e,t,i){i=i.toLowerCase(),i.length>3&&"fa-"===i.substring(0,3)&&(i=i.substring(3));const s=[],o=new Set;e.includes(i)&&(s.push(i),o.add(i));for(const n of e)n!==i&&t[n].search.terms.includes(i)&&(s.push(n),o.add(n));for(const t of e)o.has(t)||0!==t.indexOf(i)||(s.push(t),o.add(t));return s}(o,i,s)),this._populateGrid(o,i)}render(){super.render();for(const e of this.items)this.focusTracker.add(e.element);this.items.on("change",((e,{added:t,removed:i})=>{if(t.length>0)for(const e of t)this.focusTracker.add(e.element);if(i.length>0)for(const e of i)this.focusTracker.remove(e.element)})),this.keystrokes.listenTo(this.element)}destroy(){super.destroy(),this.focusTracker.destroy(),this.keystrokes.destroy()}focus(){if(this.iconName){const e=this.items.find((e=>e.isOn));if(e)return void e.focus()}const e=this.items.first;e&&e.focus()}_populateGrid(e,t,i=0){const s=this.expandButtonView;this.stopListening(s,"execute");const o=e.length-i,r=new n.View,c=this.createCollection();for(let s=0;s<Math.min(200,o);s++){const o=e[i+s];if(t[o]){const e=this._createItem(o,t[o]);c.add(e),this.items.add(e)}}r.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__grid-items"]},children:c}),this.sections.add(r),this.itemsView.registerChild(r),this.itemsView.element.appendChild(r.element),o>200?(s.set("isVisible",!0),this.listenTo(s,"execute",(()=>{this.items.last.focus(),this._populateGrid(e,t,i+200)})),this.fire("gridSectionLoad",!0)):(s.set("isVisible",!1),this.fire("gridSectionLoad",!1))}}t.default=d},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(0),n=s(i(15));class r extends o.ButtonView{constructor(e,t,i,s){super(e);const o=this.bindTemplate;this.set({label:e.t(s.label),class:"ckeditor5-icons__grid-item",isOn:!1,withText:!0}),this.faIcon=new n.default(e,t,i,s),this.faIcon.extendTemplate({attributes:{class:["ck-icon","ck-button__icon","ck-icon_inherit-color"]}}),this.extendTemplate({attributes:{title:i},on:{mouseover:o.to("mouseover"),focus:o.to("focus")}}),this.registerChild([this.faIcon])}render(){super.render(),this.element.appendChild(this.faIcon.element)}}t.default=r},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(0),n=s(i(15)),r=s(i(21)),c=s(i(22));class a extends o.View{constructor(e,t){super(e),this.faVersion=t;const i=e.t,s=this.bindTemplate;this.searchView=new c.default(e),this.searchView.delegate("search").to(this),this.iconPreviewView=new o.View,this.iconPreviewView.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__icon-preview"]}}),this.faIcon=null,this.formView=new r.default(e),this.formView.delegate("changeStyle","cancel").to(this),this.formView.delegate("submit").to(this,"execute"),this.formView.bind("iconStyle").to(this),this.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__picker-footer"]},children:[{tag:"div",attributes:{class:["ck","ckeditor5-icons__footer-flex",s.to("iconName",(e=>e?"":"ck-hidden"))]},children:[{tag:"div",attributes:{class:["ck","ckeditor5-icons__picker-preview"]},children:[this.iconPreviewView,{tag:"div",attributes:{class:["ck","ckeditor5-icons__icon-info"]},children:[{tag:"span",attributes:{class:["ck","ckeditor5-icons__icon-label"]},children:[{text:s.to("iconDefinition",(e=>e?i(e.label):""))}]},{tag:"span",attributes:{class:["ck","ckeditor5-icons__icon-name"]},children:[{text:s.to("iconName")}]}]}]},this.formView]},{tag:"div",attributes:{class:["ck","ckeditor5-icons__footer-flex",s.to("iconName",(e=>e?"ck-hidden":""))]},children:[this.searchView,{tag:"div",attributes:{class:["ck","ckeditor5-icons__library-attr"]},children:[{text:"5"===t?"Font Awesome 5":"Font Awesome 6"}]}]}]})}refresh(){this.iconDefinition&&this.formView.refresh(this.iconName,this.iconDefinition);const e=this.iconPreviewView;let t=null;this.faIcon&&(e.deregisterChild(this.faIcon),e.element.innerText=""),this.iconName&&this.iconDefinition&&(t=new n.default(this.locale,this.faVersion,this.iconName,this.iconDefinition,this.iconStyle),e.registerChild(t),e.element.appendChild(t.element)),this.faIcon=t}}t.default=a},(e,t,i)=>{e.exports=i(3)("./src/widget.js")},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),o=i(4);class n extends s.View{constructor(e,t,i,s,n){super(e),this.setTemplate({tag:"i",attributes:{class:["ck","ckeditor5-icons__icon",(0,o.getFAStyleClass)(t,(0,o.getValidIconStyle)(s,n)),"fa-"+i]}})}}t.default=n},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(1);class o extends s.Command{execute({iconClass:e="fa-solid fa-chess-rook"}){const{editing:t,model:i}=this.editor;i.change((s=>{const o=s.createElement("icon",{iconClass:e});i.insertContent(o),t.view.focus(),s.setSelection(o,"on")}))}refresh(){const{model:e}=this.editor,{selection:t}=e.document,i=e.schema.findAllowedParent(t.getFirstPosition(),"icon");this.isEnabled=null!==i}}t.default=o},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(1),o=i(4);class n extends s.Command{constructor(e,t,i){super(e),this.attributeName=t,this.defaultValue=i,this.value=i}refresh(){const e=this.editor.model,t=(0,o.getSelectedIconWidget)(e.document.selection),i=this.attributeName,s=this.defaultValue;this.isEnabled=!!t,this.isEnabled?this.value=t.hasAttribute(i)?t.getAttribute(i):s:this.value=s}execute(e={value:this.defaultValue}){const t=this.editor.model,i=(0,o.getSelectedIconWidget)(t.document.selection),s=this.attributeName,n=this.defaultValue;i&&t.change((t=>t.setAttribute(s,e.value||n,i)))}}t.default=n},(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>s});const s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\x3c!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --\x3e<path d="M500.3 7.3C507.7 13.3 512 22.4 512 32V176c0 26.5-28.7 48-64 48s-64-21.5-64-48s28.7-48 64-48V71L352 90.2V208c0 26.5-28.7 48-64 48s-64-21.5-64-48s28.7-48 64-48V64c0-15.3 10.8-28.4 25.7-31.4l160-32c9.4-1.9 19.1 .6 26.6 6.6zM74.7 304l11.8-17.8c5.9-8.9 15.9-14.2 26.6-14.2h61.7c10.7 0 20.7 5.3 26.6 14.2L213.3 304H240c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V352c0-26.5 21.5-48 48-48H74.7zM192 408a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM478.7 278.3L440.3 368H496c6.7 0 12.6 4.1 15 10.4s.6 13.3-4.4 17.7l-128 112c-5.6 4.9-13.9 5.3-19.9 .9s-8.2-12.4-5.3-19.2L391.7 400H336c-6.7 0-12.6-4.1-15-10.4s-.6-13.3 4.4-17.7l128-112c5.6-4.9 13.9-5.3 19.9-.9s8.2 12.4 5.3 19.2zm-339-59.2c-6.5 6.5-17 6.5-23 0L19.9 119.2c-28-29-26.5-76.9 5-103.9c27-23.5 68.4-19 93.4 6.5l10 10.5 9.5-10.5c25-25.5 65.9-30 93.9-6.5c31 27 32.5 74.9 4.5 103.9l-96.4 99.9z"/></svg>'},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(5),o=i(0);class n extends o.FormHeaderView{constructor(e,t,i,s){super(e),this.categoryDropdownView=this._createCategoryDropdown(e,t,i,s),this.categoryDropdownView.panelPosition="rtl"===e.uiLanguageDirection?"se":"sw",this.label=e.t("Icons"),this.class="ckeditor5-icons__picker-header",this.children.add(this.categoryDropdownView),this.on("execute",((e,t,i)=>{this.set("categoryName",t),this.set("categoryDefinition",i)}))}focus(){this.categoryDropdownView.focus()}_createCategoryDropdown(e,t,i,s){const n=(0,o.createDropdown)(e),r=this._createCategoryDropdownItems(e,t,i,s),c="Select a category",a=e.t;return n.buttonView.set({label:a(c),tooltip:a("Icon categories"),withText:!0,class:"ck-dropdown__button_label-width_auto"}),n.buttonView.bind("label").to(this,"categoryDefinition",(e=>a(e?e.label:c))),n.on("execute",(e=>{const i=e.source.name;this.fire("execute",i,t[i])})),(0,o.addListToDropdown)(n,r),n}_createCategoryDropdownItems(e,t,i,o){const n=[],r={all:{icons:[],label:"All"},brands:{icons:[],label:"Brands"}};o&&(n.push("recommended"),r.recommended={icons:o,label:"Recommended"}),n.push("all"),i.includes("brands")&&n.push("brands");const c=new s.Collection,a=Object.entries(t);for(const i of n){const s=r[i],o="_"+i;this._addCategoryDropdownItem(e,c,o,s),t[o]||(t[o]=s)}c.add({type:"separator"});for(const[t,i]of a)"_"!==t[0]&&this._addCategoryDropdownItem(e,c,t,i);return c}_addCategoryDropdownItem(e,t,i,s){const n=new o.Model({name:i,label:e.t(s.label),withText:!0});n.bind("isOn").to(this,"categoryName",(e=>e===i)),t.add({type:"button",model:n})}}t.default=n},(e,t,i)=>{"use strict";function s({keystrokeHandler:e,focusTracker:t,gridItems:i,numberOfColumns:s,uiLanguageDirection:o}){const n="number"==typeof s?()=>s:s;function r(e){return s=>{const o=i.find((e=>e.element===t.focusedElement)),n=i.getIndex(o),r=e(n,i);i.get(r).focus(),s.stopPropagation(),s.preventDefault()}}function c(e,t){return e===t-1?0:e+1}function a(e,t){return 0===e?t-1:e-1}e.set("arrowright",r(((e,t)=>"rtl"===o?a(e,t.length):c(e,t.length)))),e.set("arrowleft",r(((e,t)=>"rtl"===o?c(e,t.length):a(e,t.length)))),e.set("arrowup",r(((e,t)=>{let i=e-n();return i<0&&(i=e+n()*Math.floor(t.length/n()),i>t.length-1&&(i-=n())),i}))),e.set("arrowdown",r(((e,t)=>{let i=e+n();return i>t.length-1&&(i=e%n()),i})))}i.r(t),i.d(t,{default:()=>s})},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),o=i(1),n=i(5),r=i(2);class c extends s.View{constructor(e){super(e);const t=e.t;this.styleDropdownView=this._createStyleDropdown(e),this.styleDropdownItems=new n.Collection,(0,s.addListToDropdown)(this.styleDropdownView,this.styleDropdownItems),this.submitButtonView=a(t("Insert"),o.icons.check,"ck-button-save"),this.submitButtonView.type="submit",this.cancelButtonView=a(t("Cancel"),o.icons.cancel,"ck-button-cancel"),this.cancelButtonView.delegate("execute").to(this,"cancel"),this.setTemplate({tag:"form",attributes:{class:["ck","ckeditor5-icons__picker-form"]},children:[this.styleDropdownView,this.submitButtonView,this.cancelButtonView]})}refresh(e,t){if(!e||e===this.iconName)return;const i=this.styleDropdownItems;i.clear();for(const e of t.styles){const t=new s.Model({name:e,label:this.locale.t(r.faStyleLabels[e]),withText:!0});t.bind("isOn").to(this,"iconStyle",(t=>t===e)),i.add({type:"button",model:t})}this.iconName=e}render(){super.render(),(0,s.submitHandler)({view:this})}focus(){this.submitButtonView.isEnabled&&this.submitButtonView.focus()}_createStyleDropdown(e){const t=(0,s.createDropdown)(e),i="Select a style",o=e.t;return t.buttonView.set({label:o(i),tooltip:o("Styles available for this icon"),withText:!0,class:"ck-dropdown__button_label-width_auto"}),t.buttonView.bind("label").to(this,"iconStyle",(e=>{const t=r.faStyleLabels[e];return o(t||i)})),t.on("execute",(e=>this.fire("changeStyle",e.source.name))),t}}function a(e,t,i,o){const n=new s.ButtonView;return n.set({label:"string"==typeof o?o:e,icon:t,tooltip:!!t&&e,withText:o||!t,class:i}),n}t.default=c},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0);class o extends s.View{constructor(e){super(e);const t=e.t;let i;this.searchFieldView=new s.LabeledFieldView(e,s.createLabeledInputText),this.searchFieldView.label=t("Search all icons"),this.searchFieldView.fieldView.on("input",(e=>{const t=e.source.element.value;i&&clearTimeout(i),i=setTimeout((()=>this.fire("search",t)),500)})),this.setTemplate({tag:"form",attributes:{class:["ck","ckeditor5-icons__picker-search"]},children:[this.searchFieldView]})}}t.default=o},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),o=i(2),n=i(1),r=i(14);class c extends n.Plugin{static get requires(){return[r.WidgetToolbarRepository]}init(){const e=this.editor,t=e.commands,i=e.ui.componentFactory,s=t.get("sizeIcon"),r=t.get("alignIcon");i.add("iconSize",(e=>this._createToolbarDropdown(e,"Icon size",o.sizeOptions[o.sizeDefault].icon,n.icons.objectSizeFull,s,o.sizeOptions,o.sizeDefault))),i.add("iconAlignment",(e=>this._createToolbarDropdown(e,"Icon alignment",o.alignmentOptions[o.alignmentDefault].icon,null,r,o.alignmentOptions,o.alignmentDefault)))}afterInit(){this.editor.plugins.get(r.WidgetToolbarRepository).register("icon",{items:["iconSize","iconAlignment"],getRelatedElement:e=>{const t=e.getSelectedElement();return t&&t.is("element")&&t.hasClass("ckeditor5-icons__widget")?t:null}})}_createToolbarDropdown(e,t,i,o,n,r,c){const a=(0,s.createDropdown)(e),l=a.buttonView,d=e.t;return(0,s.addToolbarToDropdown)(a,Object.entries(r).map((([t,i])=>this._createToolbarButton(e,i.label,i.icon,n,t)))),l.set({label:d(t),icon:i,tooltip:d(t),withText:!i}),i===r[c].icon&&this.listenTo(n,"change:value",((e,t,i)=>{const s=r[i];l.set("label",d(s.label)),l.set("icon",s.icon||o||void 0),l.set("withText",!s.icon)})),a.bind("isEnabled").to(n,"isEnabled"),a}_createToolbarButton(e,t,i,o,n){const r=this.editor,c=new s.ButtonView;return c.set({label:e.t(t),icon:i,tooltip:!!i,isToggleable:!0,withText:!i}),c.bind("isEnabled").to(o),c.bind("isOn").to(o,"value",(e=>e===n)),this.listenTo(c,"execute",(()=>{o.execute({value:n}),r.editing.view.focus()})),c}}t.default=c}],t={};function i(s){var o=t[s];if(void 0!==o)return o.exports;var n=t[s]={exports:{}};return e[s].call(n.exports,n,n.exports,i),n.exports}i.d=(e,t)=>{for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var s=i(6);return s=s.default})()));