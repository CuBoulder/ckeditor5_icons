!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.CKEditor5=t():(e.CKEditor5=e.CKEditor5||{},e.CKEditor5.icon=t())}(self,(()=>(()=>{var e=[(e,t,i)=>{e.exports=i(4)("./src/ui.js")},(e,t,i)=>{e.exports=i(4)("./src/core.js")},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.faStyleClassByVersion=t.faStyleLabels=t.alignmentDefault=t.alignmentOptions=t.sizeDefault=t.sizeOptions=void 0;const s=i(1);t.sizeOptions={extraSmall:{label:"Extra Small",icon:s.icons.objectSizeSmall,className:"fa-xs"},small:{label:"Small",icon:s.icons.objectSizeSmall,className:"fa-sm"},regular:{label:"Regular",icon:s.icons.objectSizeMedium},large:{label:"Large",icon:s.icons.objectSizeLarge,className:"fa-lg"},extraLarge:{label:"Extra Large",icon:s.icons.objectSizeFull,className:"fa-xl"},"2x":{label:"2x",className:"fa-2x"},"3x":{label:"3x",className:"fa-3x"},"4x":{label:"4x",className:"fa-4x"},"5x":{label:"5x",className:"fa-5x"},"6x":{label:"6x",className:"fa-6x"},"7x":{label:"7x",className:"fa-7x"},"8x":{label:"8x",className:"fa-8x"},"9x":{label:"9x",className:"fa-9x"},"10x":{label:"10x",className:"fa-10x"}},t.sizeDefault="regular",t.alignmentOptions={none:{label:"With text",icon:s.icons.objectCenter},left:{label:"Pull left",icon:s.icons.objectLeft,className:"fa-pull-left"},right:{label:"Pull right",icon:s.icons.objectRight,className:"fa-pull-right"}},t.alignmentDefault="none",t.faStyleLabels={solid:"Solid",regular:"Regular",light:"Light",thin:"Thin",duotone:"Duotone",brands:"Brands"},t.faStyleClassByVersion={6:{solid:"fa-solid",regular:"fa-regular",light:"fa-light",thin:"fa-thin",duotone:"fa-duotone",brands:"fa-brands"},5:{solid:"fas",regular:"far",light:"fal",duotone:"fad",brands:"fab"}}},(e,t,i)=>{e.exports=i(4)("./src/utils.js")},e=>{"use strict";e.exports=CKEditor5.dll},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getFAStyleClass=t.getValidIconStyle=t.getSelectedIconWidget=void 0;const s=i(2);t.getSelectedIconWidget=function(e){const t=e.getSelectedElement();return t&&t.is("element")&&"icon"===t.name?t:null},t.getValidIconStyle=function(e,t){const i=e.styles;let s=0;if(t){const e=i.indexOf(t);-1!==e&&(s=e)}return i[s]},t.getFAStyleClass=function(e,t){return s.faStyleClassByVersion[e][t]||"fas"}},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0);class o extends s.View{constructor(e,t,i,s=!0){super(e),this.set("isVisible",s),this.setTemplate({tag:t,attributes:{class:["ck",this.bindTemplate.to("isVisible",(e=>e?"":"ck-hidden"))]},children:i})}}t.default=o},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createButton=void 0;const s=i(0);t.createButton=function(e,t,i,o,n){const r=new s.ButtonView(e);return r.set({label:"string"==typeof n?n:t,icon:i,tooltip:!!i&&t,withText:n||!i,class:o}),r}},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=s(i(9));t.default={Icon:o.default}},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(1),n=s(i(10)),r=s(i(11)),l=s(i(26));class a extends o.Plugin{static get requires(){return[n.default,r.default,l.default]}}t.default=a},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(1),n=i(18),r=s(i(20)),l=s(i(21)),a=i(2);class c extends o.Plugin{static get requires(){return[n.Widget]}init(){this._defineSchema(),this._defineConverters(),this._defineCommands()}_defineSchema(){this.editor.model.schema.register("icon",{isObject:!0,isInline:!0,allowWhere:"$text",allowAttributes:["iconClass","iconSize","iconAlignment"]})}_defineConverters(){const{conversion:e}=this.editor;e.for("upcast").attributeToAttribute({model:{key:"iconClass",value:e=>{if(!e.hasAttribute("class"))return"";const t=e.getAttribute("class").match(/(fa-([a-z0-9\-]+)|fas|far|fal|fad|fab)/g);let i="";if(t)for(const e of t)e.match(/fa-(2xs|xs|sm|lg|xl|2xl|([0-9]|10)x)/)||e.match(/fa-(pull-left|pull-right)/)||(i=i?i+" "+e:e);return i}},view:"class"}),e.attributeToAttribute(d("iconSize",a.sizeOptions)),e.attributeToAttribute(d("iconAlignment",a.alignmentOptions)),e.for("upcast").elementToElement({model:"icon",view:{name:"i",classes:/(fa-(solid|regular|light|thin|duotone|brands))|fas|far|fal|fad|fab/}}),e.for("dataDowncast").elementToElement({model:"icon",view:(e,{writer:t})=>function(e,t){const i=e.getAttribute("iconClass");return t.createContainerElement("i",{class:i})}(e,t)}),e.for("editingDowncast").elementToElement({model:"icon",view:(e,{writer:t})=>function(e,t){const i=e.getAttribute("iconClass");return(0,n.toWidget)(t.createContainerElement("span",{class:"ckeditor5-icons__widget"},[t.createRawElement("span",{},(e=>e.innerHTML='<i class="'+i+'"></i>'))]),t,{label:"icon widget"})}(e,t)})}_defineCommands(){const e=this.editor,t=e.commands;t.add("insertIcon",new r.default(e)),t.add("sizeIcon",new l.default(e,"iconSize",a.sizeDefault)),t.add("alignIcon",new l.default(e,"iconAlignment",a.alignmentDefault))}}function d(e,t){const i={},s=[];for(const[e,o]of Object.entries(t))o.className&&(s.push(e),i[e]={key:"class",value:o.className});return{model:{key:e,values:s},view:i}}t.default=c},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(1),n=i(0),r=s(i(22)),l=s(i(12)),a=i(5),c=i(2);class d extends o.Plugin{init(){const{commands:e,config:t,ui:i}=this.editor,s=e.get("insertIcon"),o=i.componentFactory,d=t.get("icon.faVersion")||"6",h=t.get("icon.faCategories")||{},u=t.get("icon.faIcons")||{},f=t.get("icon.faStyles"),w=t.get("icon.recommendedIcons");let m=Object.keys(c.faStyleLabels);f&&(m=m.filter((e=>f.includes(e)))),o.add("icon",(e=>{const t=(0,n.createDropdown)(e);let i;return t.buttonView.set({label:e.t("Icons"),icon:r.default,tooltip:!0}),t.bind("isEnabled").to(s,"isEnabled"),t.on("change:isOpen",(()=>{i||(i=new l.default(e,d,h,u,m,w),this.listenTo(i,"execute",((e,t,i)=>{s.execute({iconClass:(0,a.getFAStyleClass)(d,i)+" fa-"+t})})),t.panelView.children.add(i))})),t}))}}t.default=d},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(0),n=i(3),r=i(5),l=s(i(13)),a=s(i(14)),c=s(i(16));class d extends o.View{constructor(e,t,i,s,d,h){super(e),this.set("iconName",null),this.set("iconStyle",null),this.set("iconDefinition",null),this.headerView=new l.default(e,t,i,d,h),this.gridView=new a.default(e,t),this.footerView=new c.default(e,t,d),this.searchFieldView=this.footerView.searchView.searchFieldView.fieldView;const u=this.footerView.searchView.clearButtonView;let f;this.items=this.createCollection(),this.focusTracker=new n.FocusTracker,this.keystrokes=new n.KeystrokeHandler,new o.FocusCycler({focusables:this.items,focusTracker:this.focusTracker,keystrokeHandler:this.keystrokes,actions:{focusPrevious:"shift + tab",focusNext:"tab"}}),this.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__picker"],tabindex:"-1"},children:[this.headerView,this.gridView,this.footerView]}),this.items.add(this.headerView),this.listenTo(this.headerView,"execute",((e,t,i)=>{this.set("iconName",null),this.set("iconDefinition",null),this.gridView.refresh(s,t,i),this.footerView.refresh(),this.gridView.allCategoryFilterView.buttonView.isVisible?this._startTracking(this.gridView.allCategoryFilterView.buttonView,this.items.getIndex(this.headerView)+1):this._stopTracking(this.gridView.allCategoryFilterView.buttonView),this._stopTrackingFooterForm(),"_brands"===t?(this.footerView.styleFilterView.buttonView.isVisible=!1,this._stopTracking(this.footerView.styleFilterView.buttonView)):this.footerView.styleFilterView.buttonView.isVisible=!0,f=null})),this.listenTo(this.gridView,"execute",((e,t,i)=>{t&&i?(this.set("iconName",t),this.set("iconStyle",(0,r.getValidIconStyle)(i,this.iconStyle)),this.set("iconDefinition",i),this.footerView.refresh(),this._startTrackingFooterForm()):this._clearSelectedIcon()})),this.listenTo(this.gridView,"gridSectionLoad",((e,t,i)=>{t?this._startTracking(this.gridView,this.items.getIndex(this.headerView)+1):this._stopTracking(this.gridView),i?this._startTracking(this.gridView.expandButtonView,this.items.getIndex(this.searchFieldView)):this._stopTracking(this.gridView.expandButtonView)})),this.listenTo(this.footerView,"search",((e,t)=>{this.iconName&&(this.set("iconName",null),this.set("iconDefinition",null),this.footerView.refresh(),this._stopTrackingFooterForm()),t?(this.gridView.refresh(s,"_all",i._all,t),this.headerView.set("categoryAttributionName","_search"),this.headerView.categoryDropdownView.buttonView.isVisible=!1,this._stopTracking(this.headerView),u.isVisible=!0,this._startTracking(u,this.items.getIndex(this.searchFieldView)+1),this.footerView.styleFilterView.buttonView.isVisible=!0,this._startTracking(this.footerView.styleFilterView.buttonView),f=t):(this.headerView.fire("execute",this.headerView.categoryName,this.headerView.categoryDefinition),u.isVisible=!1,this._stopTracking(u),this.headerView.categoryDropdownView.buttonView.isVisible=!0,this._startTracking(this.headerView,0))})),this.listenTo(this.gridView,"change:styleFilter",(()=>{f?this.gridView.refresh(s,"_all",i._all,f):this.gridView.refresh(s)})),this.listenTo(this.footerView,"changeStyle",((e,t)=>{this.set("iconStyle",t),this.footerView.refresh()})),this.on("cancel",(e=>this._clearSelectedIcon(!0))),this.keystrokes.set("Esc",((e,t)=>{this.iconName?(this._clearSelectedIcon(!0),t()):this.items.has(u)&&(u.fire("execute"),t())})),this.gridView.bind("iconName").to(this),this.gridView.bind("categoryName","categoryDefinition").to(this.headerView),this.gridView.bind("styleFilter").to(this.footerView),this.footerView.bind("iconName","iconStyle","iconDefinition").to(this),this.footerView.on("execute",(()=>{this.fire("execute",this.iconName,this.iconStyle),this._clearSelectedIcon()})),this.footerView.delegate("cancel").to(this),i._recommended?this.headerView.fire("execute","_recommended",i._recommended):this.headerView.fire("execute","_all",i._all)}_startTracking(e,t){this.items.has(e)||(this.items.add(e,t),this.focusTracker.add(e.element))}_stopTracking(e){this.items.has(e)&&(this.items.remove(e),this.focusTracker.remove(e.element))}_startTrackingFooterForm(){this._stopTracking(this.footerView.styleFilterView.buttonView),this._stopTracking(this.searchFieldView),this._startTracking(this.footerView.formView.styleDropdownView.buttonView),this._startTracking(this.footerView.formView.submitButtonView),this._startTracking(this.footerView.formView.cancelButtonView)}_stopTrackingFooterForm(){this._stopTracking(this.footerView.formView.styleDropdownView.buttonView),this._stopTracking(this.footerView.formView.submitButtonView),this._stopTracking(this.footerView.formView.cancelButtonView),this._startTracking(this.searchFieldView),this._startTracking(this.footerView.styleFilterView.buttonView)}_clearSelectedIcon(e=!1){var t;e&&this.focusTracker.isFocused&&(null===(t=this.focusTracker.focusedElement)||void 0===t?void 0:t.parentElement)===this.footerView.formView.element&&this.gridView.focus(),this.set("iconName",null),this.set("iconDefinition",null),this.footerView.refresh(),this._stopTrackingFooterForm()}render(){super.render(),this.focusTracker.add(this.headerView.element),this.keystrokes.listenTo(this.element)}destroy(){super.destroy(),this.focusTracker.destroy(),this.keystrokes.destroy()}focus(){this.items.has(this.searchFieldView)?this.searchFieldView.focus():this.headerView.focus()}}t.default=d},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(3),n=i(0),r=s(i(23));class l extends n.View{constructor(e,t,i,s,o){super(e);const r=this.bindTemplate,l=e.t;this.categoryDropdownView=this._createCategoryDropdown(e,i,s,o),this.categoryDropdownView.panelPosition="rtl"===e.uiLanguageDirection?"se":"sw",this.attributionIconView=new n.View(e),this.attributionIconView.setTemplate({tag:"span",attributes:{class:["ck",r.to("categoryAttributionName",(e=>"_recommended"===e||"_search"===e?"ck-hidden":""))]}}),this.attributionView=new n.View(e),this.attributionView.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__library-attr"]},children:[this.attributionIconView,{tag:"span",children:[{text:r.to("categoryAttributionName",(e=>"_recommended"===e?l("Recommended"):"_search"===e?l("Search"):"5"===t?"Font Awesome 5":"Font Awesome 6"))}]}]}),this.setTemplate({tag:"div",attributes:{class:["ck","ck-form__header","ckeditor5-icons__picker-header"]},children:[{tag:"div",children:[{tag:"h2",attributes:{class:["ck","ck-form__header__label"]},children:[{text:l("Icons")}]},this.attributionView]},this.categoryDropdownView]}),this.on("execute",((e,t,i)=>{this.set("categoryName",t),this.set("categoryAttributionName",t),this.set("categoryDefinition",i)}))}render(){super.render(),this.attributionIconView.element.innerHTML=r.default}focus(){this.categoryDropdownView.focus()}_createCategoryDropdown(e,t,i,s){const o=(0,n.createDropdown)(e),r=this._createCategoryDropdownItems(e,t,i,s),l="Select a category",a=e.t;return o.buttonView.set({label:a(l),tooltip:a("Icon categories"),withText:!0,class:"ck-dropdown__button_label-width_auto"}),o.buttonView.bind("label").to(this,"categoryDefinition",(e=>a(e?e.label:l))),o.panelView.extendTemplate({attributes:{tabindex:"-1"}}),o.on("execute",(e=>{const i=e.source.name;this.fire("execute",i,t[i])})),(0,n.addListToDropdown)(o,r),o}_createCategoryDropdownItems(e,t,i,s){const n=new o.Collection,r=[],l={all:{icons:[],label:"All"},brands:{icons:[],label:"Brands"}};if(s){const i=t._recommended={icons:s,label:"Recommended"};this._addCategoryDropdownItem(e,n,"_recommended",i),n.add({type:"separator"})}r.push("all"),i.includes("brands")&&r.push("brands");const a=Object.entries(t);for(const i of r){const s=l[i],o="_"+i;this._addCategoryDropdownItem(e,n,o,s),t[o]=s}n.add({type:"separator"});for(const[t,i]of a)"_"!==t[0]&&this._addCategoryDropdownItem(e,n,t,i);return n}_addCategoryDropdownItem(e,t,i,s){const o=new n.Model({name:i,label:e.t(s.label),withText:!0});o.bind("isOn").to(this,"categoryName",(e=>e===i)),t.add({type:"button",model:o})}}t.default=l},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(3),n=i(0),r=s(i(24)),l=s(i(15)),a=i(0),c=s(i(6)),d=i(2);class h extends n.View{constructor(e,t){super(e),this.faVersion=t,this.set("allCategoryFilter","a");const s=this.bindTemplate,l=e.t;this.items=this.createCollection(),this.sections=this.createCollection(),this.allCategoryFilterView=this._createAllCategoryFilterDropdown(e),this.itemsView=new n.View(e),this.itemsView.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__grid-section"]}}),this.fallbackView=new c.default(e,"div",[{text:s.to("styleFilter",(e=>e&&"all"!==e?l('No icons in the "%0" style match your search.',[d.faStyleLabels[e]]):l("No icons match your search.")))}]),this.fallbackView.extendTemplate({attributes:{class:"ckeditor5-icons__grid-fallback"}}),this.expandButtonView=new a.ButtonView(e),this.expandButtonView.set({icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M.941 4.523a.75.75 0 1 1 1.06-1.06l3.006 3.005 3.005-3.005a.75.75 0 1 1 1.06 1.06l-3.549 3.55a.75.75 0 0 1-1.168-.136L.941 4.523z"></path></svg>',label:l("Expand"),tooltip:l("Show more icons"),withText:!0,isVisible:!1,class:"ckeditor5-icons__grid-expand"}),this.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__grid"]},children:[{tag:"div",attributes:{class:["ck","ckeditor5-icons__grid-options","ckeditor5-icons__grid-options-top",this.allCategoryFilterView.buttonView.bindTemplate.to("isVisible",(e=>e?"":"ck-hidden"))]},children:[this.allCategoryFilterView]},{tag:"div",attributes:{class:["ck","ckeditor5-icons__grid-scrollable"]},children:[this.fallbackView,this.itemsView,{tag:"div",attributes:{class:["ck","ckeditor5-icons__grid-options","ckeditor5-icons__grid-options-bottom",this.expandButtonView.bindTemplate.to("isVisible",(e=>e?"":"ck-hidden"))]},children:[this.expandButtonView]}]}]}),this.focusTracker=new o.FocusTracker,this.keystrokes=new o.KeystrokeHandler,(0,r.default)({keystrokeHandler:this.keystrokes,focusTracker:this.focusTracker,gridItems:this.items,numberOfColumns:()=>i.g.window.getComputedStyle(this.itemsView.element.firstChild).getPropertyValue("grid-template-columns").split(" ").length,uiLanguageDirection:e.uiLanguageDirection})}_createItem(e,t){const i=new l.default(this.locale,this.faVersion,e,t,this.styleFilter&&"all"!==this.styleFilter?this.styleFilter:null);return i.on("mouseover",(()=>this.fire("itemHover",e,t))),i.on("focus",(()=>this.fire("itemFocus",e,t))),i.on("execute",(()=>this.fire("execute",e,t))),i.bind("isOn").to(this,"iconName",(t=>e===t)),i}refresh(e,t,i,s){const o=t||this.categoryName,n=i||this.categoryDefinition;let r;if(this.items.clear(),this.itemsView.deregisterChild(this.sections),this.itemsView.element&&(this.itemsView.element.innerText=""),this.sections.clear(),r="_all"===o?Object.keys(e):"_brands"===o?Object.keys(e).filter((t=>e[t].styles.includes("brands"))):n?n.icons:[],s&&(r=function(e,t,i){i=i.toLowerCase(),i.length>3&&"fa-"===i.substring(0,3)&&(i=i.substring(3));const s=[],o=new Set;e.includes(i)&&(s.push(i),o.add(i));for(const n of e)n!==i&&t[n].search.terms.includes(i)&&(s.push(n),o.add(n));for(const t of e)o.has(t)||0!==t.indexOf(i)||(s.push(t),o.add(t));return s}(r,e,s)),s||"_all"!==o)this.allCategoryFilterView.buttonView.isVisible=!1;else{const t=this.allCategoryFilter;r="#"===t?r.filter((e=>"0123456789".includes(e[0]))):r.filter((e=>e[0]===t[0])),this.allCategoryFilterViewItems||(this.allCategoryFilterViewItems=this._createAllCategoryFilterDropdownItems(),(0,a.addListToDropdown)(this.allCategoryFilterView,this.allCategoryFilterViewItems),this.on("change:allCategoryFilter",(()=>{this.refresh(e),this.fire("execute",null,null)}))),this.allCategoryFilterView.buttonView.isVisible=!0}"_brands"!==o&&this.styleFilter&&"all"!==this.styleFilter&&(r=r.filter((t=>{var i;return null===(i=e[t])||void 0===i?void 0:i.styles.includes(this.styleFilter)}))),0===r.length?(this.fallbackView.isVisible=!0,this.expandButtonView.isVisible=!1,this.fire("gridSectionLoad",!1,!1)):(this.fallbackView.isVisible=!1,this._populateGrid(r,e))}render(){super.render();const e=this.sections.get(0);if(e){for(const t of this.items){const i=t.element;e.element.appendChild(i),this.focusTracker.add(i)}this.itemsView.element.appendChild(e.element)}this.items.on("change",((e,{added:t,removed:i})=>{for(const e of t)this.focusTracker.add(e.element);for(const e of i)this.focusTracker.remove(e.element)})),this.keystrokes.listenTo(this.element)}destroy(){super.destroy(),this.focusTracker.destroy(),this.keystrokes.destroy()}focus(){if(this.iconName){const e=this.items.find((e=>e.isOn));if(e)return void e.focus()}const e=this.items.first;e&&e.focus()}_populateGrid(e,t,i=0){const s=this.expandButtonView;this.stopListening(s,"execute");const o=e.length-i,r=new n.View,l=this.createCollection();for(let s=0;s<Math.min(200,o);s++){const o=e[i+s];if(t[o]){const e=this._createItem(o,t[o]);l.add(e),this.items.add(e)}}r.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__grid-items"]},children:l}),this.sections.add(r),this.itemsView.registerChild(r),this.itemsView.element&&this.itemsView.element.appendChild(r.element),o>200?(s.isVisible=!0,this.listenTo(s,"execute",(()=>{this.items.last.focus(),this._populateGrid(e,t,i+200)})),this.fire("gridSectionLoad",!this.fallbackView.isVisible,!0)):(s.isVisible=!1,this.fire("gridSectionLoad",!this.fallbackView.isVisible,!1))}_createAllCategoryFilterDropdown(e){const t=(0,n.createDropdown)(e),i=e.t;return t.buttonView.set({tooltip:i("Filter All"),withText:!0,isVisible:!1,class:"ck-dropdown__button_label-width_auto"}),t.buttonView.bind("label").to(this,"allCategoryFilter",(e=>e.toUpperCase())),t.panelView.extendTemplate({attributes:{tabindex:"-1"}}),t.on("execute",(e=>this.set("allCategoryFilter",e.source.name))),t}_createAllCategoryFilterDropdownItems(){const e=new o.Collection;for(const t of"#abcdefghijklmnopqrstuvwxyz"){const i=new n.Model({name:t,label:t.toUpperCase(),withText:!0});i.bind("isOn").to(this,"allCategoryFilter",(e=>e===t)),e.add({type:"button",model:i})}return e}}t.default=h},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(0),n=s(i(19));class r extends o.ButtonView{constructor(e,t,i,s,o){super(e);const r=this.bindTemplate;this.set({label:e.t(s.label),class:"ckeditor5-icons__grid-item",isOn:!1,withText:!0}),this.faIcon=new n.default(e,t,i,s,o),this.faIcon.extendTemplate({attributes:{class:["ck-icon","ck-button__icon","ck-icon_inherit-color"]}}),this.extendTemplate({attributes:{title:i},on:{mouseover:r.to("mouseover"),focus:r.to("focus")}}),this.registerChild([this.faIcon])}render(){super.render(),this.element.appendChild(this.faIcon.element)}}t.default=r},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(3),n=i(0),r=s(i(19)),l=s(i(25)),a=s(i(17)),c=i(2),d=s(i(6));class h extends n.View{constructor(e,t,i){super(e),this.faVersion=t,this.set("styleFilter","all");const s=e.t,o=this.bindTemplate;this.searchView=new a.default(e),this.searchView.delegate("search").to(this),this.styleFilterView=this._createStyleFilterDropdown(e,i);const r=new d.default(e,"div",[this.styleFilterView]);r.bind("isVisible").to(this.styleFilterView.buttonView,"isVisible"),this.iconPreviewView=new n.View,this.iconPreviewView.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__icon-preview"]}}),this.faIcon=null,this.formView=new l.default(e),this.formView.delegate("changeStyle","cancel").to(this),this.formView.delegate("submit").to(this,"execute"),this.formView.bind("iconStyle").to(this),this.setTemplate({tag:"div",attributes:{class:["ck","ckeditor5-icons__picker-footer"]},children:[{tag:"div",attributes:{class:["ck",o.to("iconName",(e=>e?"":"ck-hidden"))]},children:[{tag:"div",attributes:{class:["ck","ckeditor5-icons__picker-preview"]},children:[this.iconPreviewView,{tag:"div",attributes:{class:["ck","ckeditor5-icons__icon-info"]},children:[{tag:"span",attributes:{class:["ck","ckeditor5-icons__icon-label"]},children:[{text:o.to("iconDefinition",(e=>e?s(e.label):""))}]},{tag:"span",attributes:{class:["ck","ckeditor5-icons__icon-name"]},children:[{text:o.to("iconName")}]}]}]},this.formView]},{tag:"div",attributes:{class:["ck",o.to("iconName",(e=>e?"ck-hidden":""))]},children:[this.searchView,r]}]})}refresh(){this.iconDefinition&&this.formView.refresh(this.iconName,this.iconDefinition);const e=this.iconPreviewView;let t=null;this.faIcon&&(e.deregisterChild(this.faIcon),e.element.innerText=""),this.iconName&&this.iconDefinition&&(t=new r.default(this.locale,this.faVersion,this.iconName,this.iconDefinition,this.iconStyle),e.registerChild(t),e.element.appendChild(t.element)),this.faIcon=t}_createStyleFilterDropdown(e,t){const i=(0,n.createDropdown)(e),s=e.t;i.buttonView.set({label:s("Select a style"),tooltip:s("Filter by style"),withText:!0,class:"ck-dropdown__button_label-width_auto"}),i.buttonView.bind("label").to(this,"styleFilter",(e=>"all"===e?s("All"):c.faStyleLabels[e])),i.on("execute",(e=>{const t=e.source.name;this.set("styleFilter",t),"all"!==t&&this.formView.fire("changeStyle",t)}));const r=new o.Collection,l=new n.Model({name:"all",label:s("All"),withText:!0});l.bind("isOn").to(this,"styleFilter",(e=>"all"===e)),r.add({type:"button",model:l}),r.add({type:"separator"});for(const e of t){const t=new n.Model({name:e,label:c.faStyleLabels[e],withText:!0});t.bind("isOn").to(this,"styleFilter",(t=>t===e)),r.add({type:"button",model:t})}return(0,n.addListToDropdown)(i,r),i}}t.default=h},function(e,t,i){"use strict";var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(0),n=i(7),r=i(1),l=s(i(6));class a extends o.View{constructor(e){super(e);const t=e.t;let i;this.searchFieldView=new o.LabeledFieldView(e,o.createLabeledInputText),this.searchFieldView.label=t("Search all icons"),this.searchFieldView.fieldView.on("input",(()=>{var e;const t=null===(e=this.searchFieldView.fieldView.element)||void 0===e?void 0:e.value;i&&clearTimeout(i),i=setTimeout((()=>this.fire("search",t)),500),this.searchFieldView.fieldView.set("value",t)})),this.clearButtonView=(0,n.createButton)(e,t("Clear search"),r.icons.cancel,"ck-button-cancel"),this.clearButtonView.isVisible=!1,this.clearButtonView.on("execute",(()=>{i&&clearTimeout(i),this.fire("search"),this.searchFieldView.fieldView.set("value",""),this.searchFieldView.focus()}));const s=new l.default(e,"div",[this.clearButtonView]);s.bind("isVisible").to(this.clearButtonView,"isVisible"),this.setTemplate({tag:"form",attributes:{class:["ck","ckeditor5-icons__picker-search"]},children:[this.searchFieldView,s]})}}t.default=a},(e,t,i)=>{e.exports=i(4)("./src/widget.js")},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),o=i(5);class n extends s.View{constructor(e,t,i,s,n){super(e),this.setTemplate({tag:"i",attributes:{class:["ck","ckeditor5-icons__icon",(0,o.getFAStyleClass)(t,(0,o.getValidIconStyle)(s,n)),"fa-"+i]}})}}t.default=n},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(1);class o extends s.Command{execute({iconClass:e="fa-solid fa-chess-rook"}){const{editing:t,model:i}=this.editor;i.change((s=>{const o=s.createElement("icon",{iconClass:e});i.insertContent(o),t.view.focus(),s.setSelection(o,"on")}))}refresh(){const{model:e}=this.editor,{selection:t}=e.document,i=e.schema.findAllowedParent(t.getFirstPosition(),"icon");this.isEnabled=null!==i}}t.default=o},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(1),o=i(5);class n extends s.Command{constructor(e,t,i){super(e),this.attributeName=t,this.defaultValue=i,this.value=i}refresh(){const e=this.editor.model,t=(0,o.getSelectedIconWidget)(e.document.selection),i=this.attributeName,s=this.defaultValue;this.isEnabled=!!t,this.isEnabled?this.value=t.hasAttribute(i)?t.getAttribute(i):s:this.value=s}execute(e={value:this.defaultValue}){const t=this.editor.model,i=(0,o.getSelectedIconWidget)(t.document.selection),s=this.attributeName,n=this.defaultValue;i&&t.change((t=>t.setAttribute(s,e.value||n,i)))}}t.default=n},(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>s});const s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\x3c!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --\x3e<path d="M500.3 7.3C507.7 13.3 512 22.4 512 32V176c0 26.5-28.7 48-64 48s-64-21.5-64-48s28.7-48 64-48V71L352 90.2V208c0 26.5-28.7 48-64 48s-64-21.5-64-48s28.7-48 64-48V64c0-15.3 10.8-28.4 25.7-31.4l160-32c9.4-1.9 19.1 .6 26.6 6.6zM74.7 304l11.8-17.8c5.9-8.9 15.9-14.2 26.6-14.2h61.7c10.7 0 20.7 5.3 26.6 14.2L213.3 304H240c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V352c0-26.5 21.5-48 48-48H74.7zM192 408a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM478.7 278.3L440.3 368H496c6.7 0 12.6 4.1 15 10.4s.6 13.3-4.4 17.7l-128 112c-5.6 4.9-13.9 5.3-19.9 .9s-8.2-12.4-5.3-19.2L391.7 400H336c-6.7 0-12.6-4.1-15-10.4s-.6-13.3 4.4-17.7l128-112c5.6-4.9 13.9-5.3 19.9-.9s8.2 12.4 5.3 19.2zm-339-59.2c-6.5 6.5-17 6.5-23 0L19.9 119.2c-28-29-26.5-76.9 5-103.9c27-23.5 68.4-19 93.4 6.5l10 10.5 9.5-10.5c25-25.5 65.9-30 93.9-6.5c31 27 32.5 74.9 4.5 103.9l-96.4 99.9z"/></svg>'},(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>s});const s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">\x3c!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --\x3e<path d="M448 48V384c-63.1 22.5-82.3 32-119.5 32c-62.8 0-86.6-32-149.3-32c-20.6 0-36.6 3.6-51.2 8.2v-64c14.6-4.6 30.6-8.2 51.2-8.2c62.7 0 86.5 32 149.3 32c20.4 0 35.6-3 55.5-9.3v-208c-19.9 6.3-35.1 9.3-55.5 9.3c-62.8 0-86.6-32-149.3-32c-50.8 0-74.9 20.6-115.2 28.7V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32s32 14.3 32 32V76.7c40.3-8 64.4-28.7 115.2-28.7c62.7 0 86.5 32 149.3 32c37.1 0 56.4-9.5 119.5-32z"/></svg>'},(e,t,i)=>{"use strict";function s({keystrokeHandler:e,focusTracker:t,gridItems:i,numberOfColumns:s,uiLanguageDirection:o}){const n="number"==typeof s?()=>s:s;function r(e){return s=>{const o=i.find((e=>e.element===t.focusedElement)),n=i.getIndex(o),r=e(n,i);i.get(r).focus(),s.stopPropagation(),s.preventDefault()}}function l(e,t){return e===t-1?0:e+1}function a(e,t){return 0===e?t-1:e-1}e.set("arrowright",r(((e,t)=>"rtl"===o?a(e,t.length):l(e,t.length)))),e.set("arrowleft",r(((e,t)=>"rtl"===o?l(e,t.length):a(e,t.length)))),e.set("arrowup",r(((e,t)=>{let i=e-n();return i<0&&(i=e+n()*Math.floor(t.length/n()),i>t.length-1&&(i-=n())),i}))),e.set("arrowdown",r(((e,t)=>{let i=e+n();return i>t.length-1&&(i=e%n()),i})))}i.r(t),i.d(t,{default:()=>s})},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),o=i(1),n=i(3),r=i(2),l=i(7);class a extends s.View{constructor(e){super(e);const t=e.t;this.styleDropdownView=this._createStyleDropdown(e),this.styleDropdownItems=new n.Collection,(0,s.addListToDropdown)(this.styleDropdownView,this.styleDropdownItems),this.submitButtonView=(0,l.createButton)(e,t("Insert"),o.icons.check,"ck-button-save"),this.submitButtonView.type="submit",this.cancelButtonView=(0,l.createButton)(e,t("Cancel"),o.icons.cancel,"ck-button-cancel"),this.cancelButtonView.delegate("execute").to(this,"cancel"),this.setTemplate({tag:"form",attributes:{class:["ck","ckeditor5-icons__picker-form"]},children:[this.styleDropdownView,this.submitButtonView,this.cancelButtonView]})}refresh(e,t){if(!e||e===this.iconName)return;const i=this.styleDropdownItems;i.clear();for(const e of t.styles){const t=new s.Model({name:e,label:r.faStyleLabels[e],withText:!0});t.bind("isOn").to(this,"iconStyle",(t=>t===e)),i.add({type:"button",model:t})}this.iconName=e}render(){super.render(),(0,s.submitHandler)({view:this})}focus(){this.submitButtonView.isEnabled&&this.submitButtonView.focus()}_createStyleDropdown(e){const t=(0,s.createDropdown)(e),i=e.t;return t.buttonView.set({label:i("Select a style"),tooltip:i("Styles available for this icon"),withText:!0,class:"ck-dropdown__button_label-width_auto"}),t.buttonView.bind("label").to(this,"iconStyle",(e=>r.faStyleLabels[e])),t.on("execute",(e=>this.fire("changeStyle",e.source.name))),t}}t.default=a},(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=i(0),o=i(2),n=i(1),r=i(18),l=i(7);class a extends n.Plugin{static get requires(){return[r.WidgetToolbarRepository]}init(){const e=this.editor,t=e.commands,i=e.ui.componentFactory;i.add("iconSize",(e=>c(e,"Icon size",o.sizeOptions[o.sizeDefault].icon,n.icons.objectSizeFull,t.get("sizeIcon"),o.sizeOptions,o.sizeDefault))),i.add("iconAlignment",(e=>c(e,"Icon alignment",o.alignmentOptions[o.alignmentDefault].icon,null,t.get("alignIcon"),o.alignmentOptions,o.alignmentDefault)))}afterInit(){this.editor.plugins.get(r.WidgetToolbarRepository).register("icon",{items:["iconSize","iconAlignment"],getRelatedElement:e=>{const t=e.getSelectedElement();return t&&t.is("element")&&t.hasClass("ckeditor5-icons__widget")?t:null}})}}function c(e,t,i,o,n,r,a){const c=(0,s.createDropdown)(e),d=c.buttonView,h=e.t;return(0,s.addToolbarToDropdown)(c,Object.entries(r).map((([t,i])=>function(e,t,i,s,o){const n=s.editor,r=(0,l.createButton)(e,t,i);return r.tooltip=!!i,r.isToggleable=!0,r.bind("isEnabled").to(s),r.bind("isOn").to(s,"value",(e=>e===o)),r.on("execute",(()=>{s.execute({value:o}),n.editing.view.focus()})),r}(e,i.label,i.icon,n,t)))),d.set({label:h(t),icon:i,tooltip:h(t),withText:!i}),i===r[a].icon&&n.on("change:value",((e,t,i)=>{const s=r[i];d.set("label",h(s.label)),d.set("icon",s.icon||o||void 0),d.set("withText",!s.icon)})),c.bind("isEnabled").to(n,"isEnabled"),c}t.default=a}],t={};function i(s){var o=t[s];if(void 0!==o)return o.exports;var n=t[s]={exports:{}};return e[s].call(n.exports,n,n.exports,i),n.exports}i.d=(e,t)=>{for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var s=i(8);return s=s.default})()));