"use strict";(function($){$(document).ready(function(){var i;$(window).bind('resize scroll',function(event){for(i=0;i<$.fn.qtip.interfaces.length;i++){var api=$.fn.qtip.interfaces[i];if(api&&api.status&&api.status.rendered&&api.options.position.type!=='static'&&api.elements.tooltip.is(':visible')&&(api.options.position.adjust.scroll&&event.type==='scroll'||api.options.position.adjust.resize&&event.type==='resize')){api.updatePosition(event,true);}}});$(document).bind('mouseenter.qtip',function(event){if($(event.target).parents('div.qtip').length===0){var tooltip=$('.qtipSelector'),api=tooltip.qtip('api');if(tooltip.is(':visible')&&api&&api.status&&!api.status.disabled&&$(event.target).add(api.elements.target).length>1){api.hide(event);}}});});function Corner(corner){if(!corner){return false;}
this.x=String(corner).replace(/middle/i,'center').match(/left|right|center/i)[0].toLowerCase();this.y=String(corner).replace(/middle/i,'center').match(/top|bottom|center/i)[0].toLowerCase();this.offset={left:0,top:0};this.precedance=(corner.charAt(0).search(/^(t|b)/)>-1)?'y':'x';this.string=function(){return(this.precedance==='y')?this.y+this.x:this.x+this.y;};}
function calculateTip(corner,width,height){var tips={bottomright:[[0,0],[width,height],[width,0]],bottomleft:[[0,0],[width,0],[0,height]],topright:[[0,height],[width,0],[width,height]],topleft:[[0,0],[0,height],[width,height]],topcenter:[[0,height],[width/2,0],[width,height]],bottomcenter:[[0,0],[width,0],[width/2,height]],rightcenter:[[0,0],[width,height/2],[0,height]],leftcenter:[[width,0],[width,height],[0,height/2]]};tips.lefttop=tips.bottomright;tips.righttop=tips.bottomleft;tips.leftbottom=tips.topright;tips.rightbottom=tips.topleft;return tips[corner];}
function calculateBorders(radius){var borders;if($('<canvas />').get(0).getContext){borders={topLeft:[radius,radius],topRight:[0,radius],bottomLeft:[radius,0],bottomRight:[0,0]};}
else if($.browser.msie){borders={topLeft:[-90,90,0],topRight:[-90,90,-radius],bottomLeft:[90,270,0],bottomRight:[90,270,-radius]};}
return borders;}
function jQueryStyle(style,sub){var styleObj,i;styleObj=$.extend(true,{},style);for(i in styleObj){if(sub===true&&(/(tip|classes)/i).test(i)){delete styleObj[i];}
else if(!sub&&(/(width|border|tip|title|classes|user)/i).test(i)){delete styleObj[i];}}
return styleObj;}
function sanitizeStyle(style){if(typeof style=='undefined')return false;if(typeof style.tip!=='object'){style.tip={corner:style.tip};}
if(typeof style.tip.size!=='object'){style.tip.size={width:style.tip.size,height:style.tip.size};}
if(typeof style.border!=='object'){style.border={width:style.border};}
if(typeof style.width!=='object'){style.width={value:style.width};}
if(typeof style.width.max==='string'){style.width.max=parseInt(style.width.max.replace(/([0-9]+)/i,"$1"),10);}
if(typeof style.width.min==='string'){style.width.min=parseInt(style.width.min.replace(/([0-9]+)/i,"$1"),10);}
if(typeof style.tip.size.x==='number'){style.tip.size.width=style.tip.size.x;delete style.tip.size.x;}
if(typeof style.tip.size.y==='number'){style.tip.size.height=style.tip.size.y;delete style.tip.size.y;}
return style;}
function buildStyle(){var self,i,styleArray,styleExtend,finalStyle,ieAdjust;self=this;styleArray=[true,{}];for(i=0;i<arguments.length;i++){styleArray.push(arguments[i]);}
styleExtend=[$.extend.apply($,styleArray)];while(typeof styleExtend[0].name==='string'){styleExtend.unshift(sanitizeStyle($.fn.qtip.styles[styleExtend[0].name]));}
styleExtend.unshift(true,{classes:{tooltip:'qtip-'+(arguments[0].name||'defaults')}},$.fn.qtip.styles.defaults);finalStyle=$.extend.apply($,styleExtend);ieAdjust=($.browser.msie)?1:0;finalStyle.tip.size.width+=ieAdjust;finalStyle.tip.size.height+=ieAdjust;if(finalStyle.tip.size.width%2>0){finalStyle.tip.size.width+=1;}
if(finalStyle.tip.size.height%2>0){finalStyle.tip.size.height+=1;}
if(finalStyle.tip.corner===true){if(self.options.position.corner.tooltip==='center'&&self.options.position.corner.target==='center'){finalStyle.tip.corner=false;}
else{finalStyle.tip.corner=self.options.position.corner.tooltip;}}
return finalStyle;}
function drawBorder(canvas,coordinates,radius,color){var context=canvas.get(0).getContext('2d');context.fillStyle=color;context.beginPath();context.arc(coordinates[0],coordinates[1],radius,0,Math.PI*2,false);context.fill();}
function createBorder(){var self,i,width,radius,color,coordinates,containers,size,betweenWidth,betweenCorners,borderTop,borderBottom,borderCoord,sideWidth,vertWidth;self=this;self.elements.wrapper.find('.qtip-borderBottom, .qtip-borderTop').remove();width=self.options.style.border.width;radius=self.options.style.border.radius;color=self.options.style.border.color||self.options.style.tip.color;coordinates=calculateBorders(radius);containers={};for(i in coordinates){containers[i]='<div rel="'+i+'" style="'+((/Left/).test(i)?'left':'right')+':0; '+'position:absolute; height:'+radius+'px; width:'+radius+'px; overflow:hidden; line-height:0.1px; font-size:1px">';if($('<canvas />').get(0).getContext){containers[i]+='<canvas height="'+radius+'" width="'+radius+'" style="vertical-align: top"></canvas>';}
else if($.browser.msie){size=radius*2+3;containers[i]+='<v:arc stroked="false" fillcolor="'+color+'" startangle="'+coordinates[i][0]+'" endangle="'+coordinates[i][1]+'" '+'style="width:'+size+'px; height:'+size+'px; margin-top:'+((/bottom/).test(i)?-2:-1)+'px; '+'margin-left:'+((/Right/).test(i)?coordinates[i][2]-3.5:-1)+'px; '+'vertical-align:top; display:inline-block; behavior:url(#default#VML)"></v:arc>';}
containers[i]+='</div>';}
betweenWidth=self.getDimensions().width-(Math.max(width,radius)*2);betweenCorners='<div class="qtip-betweenCorners" style="height:'+radius+'px; width:'+betweenWidth+'px; '+'overflow:hidden; background-color:'+color+'; line-height:0.1px; font-size:1px;">';borderTop='<div class="qtip-borderTop" dir="ltr" style="height:'+radius+'px; '+'margin-left:'+radius+'px; line-height:0.1px; font-size:1px; padding:0;">'+containers.topLeft+containers.topRight+betweenCorners;self.elements.wrapper.prepend(borderTop);borderBottom='<div class="qtip-borderBottom" dir="ltr" style="height:'+radius+'px; '+'margin-left:'+radius+'px; line-height:0.1px; font-size:1px; padding:0;">'+containers.bottomLeft+containers.bottomRight+betweenCorners;self.elements.wrapper.append(borderBottom);if($('<canvas />').get(0).getContext){self.elements.wrapper.find('canvas').each(function(){borderCoord=coordinates[$(this).parent('[rel]:first').attr('rel')];drawBorder.call(self,$(this),borderCoord,radius,color);});}
else if($.browser.msie){self.elements.tooltip.append('<v:image style="behavior:url(#default#VML);"></v:image>');}
sideWidth=Math.max(radius,(radius+(width-radius)));vertWidth=Math.max(width-radius,0);self.elements.contentWrapper.css({border:'0px solid '+color,borderWidth:vertWidth+'px '+sideWidth+'px'});}
function drawTip(canvas,coordinates,color){var context=canvas.get(0).getContext('2d');context.fillStyle=color;context.beginPath();context.moveTo(coordinates[0][0],coordinates[0][1]);context.lineTo(coordinates[1][0],coordinates[1][1]);context.lineTo(coordinates[2][0],coordinates[2][1]);context.fill();}
function positionTip(corner){var self,ieAdjust,positionAdjust,paddingCorner,paddingSize,newMargin;self=this;if(self.options.style.tip.corner===false||!self.elements.tip){return;}
if(!corner){corner=new Corner(self.elements.tip.attr('rel'));}
ieAdjust=positionAdjust=($.browser.msie)?1:0;self.elements.tip.css(corner[corner.precedance],0);if(corner.precedance==='y'){if($.browser.msie){if(parseInt($.browser.version.charAt(0),10)===6){positionAdjust=corner.y==='top'?-3:1;}
else{positionAdjust=corner.y==='top'?1:2;}}
if(corner.x==='center'){self.elements.tip.css({left:'50%',marginLeft:-(self.options.style.tip.size.width/2)});}
else if(corner.x==='left'){self.elements.tip.css({left:self.options.style.border.radius-ieAdjust});}
else{self.elements.tip.css({right:self.options.style.border.radius+ieAdjust});}
if(corner.y==='top'){self.elements.tip.css({top:-positionAdjust});}
else{self.elements.tip.css({bottom:positionAdjust});}}
else{if($.browser.msie){positionAdjust=(parseInt($.browser.version.charAt(0),10)===6)?1:(corner.x==='left'?1:2);}
if(corner.y==='center'){self.elements.tip.css({top:'50%',marginTop:-(self.options.style.tip.size.height/2)});}
else if(corner.y==='top'){self.elements.tip.css({top:self.options.style.border.radius-ieAdjust});}
else{self.elements.tip.css({bottom:self.options.style.border.radius+ieAdjust});}
if(corner.x==='left'){self.elements.tip.css({left:-positionAdjust});}
else{self.elements.tip.css({right:positionAdjust});}}
paddingCorner='padding-'+corner[corner.precedance];paddingSize=self.options.style.tip.size[corner.precedance==='x'?'width':'height'];self.elements.tooltip.css('padding',0).css(paddingCorner,paddingSize);if($.browser.msie&&parseInt($.browser.version.charAt(0),6)===6){newMargin=parseInt(self.elements.tip.css('margin-top'),10)||0;newMargin+=parseInt(self.elements.content.css('margin-top'),10)||0;self.elements.tip.css({marginTop:newMargin});}}
function createTip(corner){var self,color,coordinates,coordsize,path,tip;self=this;if(self.elements.tip!==null){self.elements.tip.remove();}
color=self.options.style.tip.color||self.options.style.border.color;if(self.options.style.tip.corner===false){return;}
else if(!corner){corner=new Corner(self.options.style.tip.corner);}
coordinates=calculateTip(corner.string(),self.options.style.tip.size.width,self.options.style.tip.size.height);self.elements.tip='<div class="'+self.options.style.classes.tip+'" dir="ltr" rel="'+corner.string()+'" style="position:absolute; '+'height:'+self.options.style.tip.size.height+'px; width:'+self.options.style.tip.size.width+'px; '+'margin:0 auto; line-height:0.1px; font-size:1px;"></div>';self.elements.tooltip.prepend(self.elements.tip);if($('<canvas />').get(0).getContext){tip='<canvas height="'+self.options.style.tip.size.height+'" width="'+self.options.style.tip.size.width+'"></canvas>';}
else if($.browser.msie){coordsize=self.options.style.tip.size.width+','+self.options.style.tip.size.height;path='m'+coordinates[0][0]+','+coordinates[0][1];path+=' l'+coordinates[1][0]+','+coordinates[1][1];path+=' '+coordinates[2][0]+','+coordinates[2][1];path+=' xe';tip='<v:shape fillcolor="'+color+'" stroked="false" filled="true" path="'+path+'" coordsize="'+coordsize+'" '+'style="width:'+self.options.style.tip.size.width+'px; height:'+self.options.style.tip.size.height+'px; '+'line-height:0.1px; display:inline-block; behavior:url(#default#VML); '+'vertical-align:'+(corner.y==='top'?'bottom':'top')+'"></v:shape>';tip+='<v:image style="behavior:url(#default#VML);"></v:image>';self.elements.contentWrapper.css('position','relative');}
self.elements.tip=self.elements.tooltip.find('.'+self.options.style.classes.tip).eq(0);self.elements.tip.html(tip);if($('<canvas  />').get(0).getContext){drawTip.call(self,self.elements.tip.find('canvas:first'),coordinates,color);}
if(corner.y==='top'&&$.browser.msie&&parseInt($.browser.version.charAt(0),10)===6){self.elements.tip.css({marginTop:-4});}
positionTip.call(self,corner);}
function createTitle(){var self=this;if(self.elements.title!==null){self.elements.title.remove();}
self.elements.tooltip.attr('aria-labelledby','qtip-'+self.id+'-title');self.elements.title=$('<div id="qtip-'+self.id+'-title" class="'+self.options.style.classes.title+'"></div>').css(jQueryStyle(self.options.style.title,true)).css({zoom:($.browser.msie)?1:0}).prependTo(self.elements.contentWrapper);if(self.options.content.title.text){self.updateTitle.call(self,self.options.content.title.text);}
if(self.options.content.title.button!==false&&typeof self.options.content.title.button==='string'){self.elements.button=$('<a class="'+self.options.style.classes.button+'" role="button" style="float:right; position: relative"></a>').css(jQueryStyle(self.options.style.button,true)).html(self.options.content.title.button).prependTo(self.elements.title).click(function(event){if(!self.status.disabled){self.hide(event);}});}}
function assignEvents(){var self,showTarget,hideTarget,inactiveEvents;self=this;showTarget=self.options.show.when.target;hideTarget=self.options.hide.when.target;if(self.options.hide.fixed){hideTarget=hideTarget.add(self.elements.tooltip);}
inactiveEvents=['click','dblclick','mousedown','mouseup','mousemove','mouseout','mouseenter','mouseleave','mouseover'];function inactiveMethod(event){if(self.status.disabled===true){return;}
clearTimeout(self.timers.inactive);self.timers.inactive=setTimeout(function(){$(inactiveEvents).each(function(){hideTarget.unbind(this+'.qtip-inactive');self.elements.content.unbind(this+'.qtip-inactive');});self.hide(event);},self.options.hide.delay);}
if(self.options.hide.fixed===true){self.elements.tooltip.bind('mouseover.qtip',function(){if(self.status.disabled===true){return;}
clearTimeout(self.timers.hide);});}
function showMethod(event){if(self.status.disabled===true){return;}
if(self.options.hide.when.event==='inactive'){$(inactiveEvents).each(function(){hideTarget.bind(this+'.qtip-inactive',inactiveMethod);self.elements.content.bind(this+'.qtip-inactive',inactiveMethod);});inactiveMethod();}
clearTimeout(self.timers.show);clearTimeout(self.timers.hide);if(self.options.show.delay>0){self.timers.show=setTimeout(function(){self.show(event);},self.options.show.delay);}
else{self.show(event);}}
function hideMethod(event){if(self.status.disabled===true){return;}
if(self.options.hide.fixed===true&&(/mouse(out|leave)/i).test(self.options.hide.when.event)&&$(event.relatedTarget).parents('div.qtip[id^="qtip"]').length>0){event.stopPropagation();event.preventDefault();clearTimeout(self.timers.hide);return false;}
clearTimeout(self.timers.show);clearTimeout(self.timers.hide);self.elements.tooltip.stop(true,true);self.timers.hide=setTimeout(function(){self.hide(event);},self.options.hide.delay);}
if(self.options.position.target==='mouse'&&self.options.position.type!=='static'){showTarget.bind('mousemove.qtip',function(event){self.cache.mouse={left:event.pageX,top:event.pageY};if(self.status.disabled===false&&self.options.position.adjust.mouse===true&&self.options.position.type!=='static'&&self.elements.tooltip.css('display')!=='none'){self.updatePosition(event);}});}
if((self.options.show.when.target.add(self.options.hide.when.target).length===1&&self.options.show.when.event===self.options.hide.when.event&&self.options.hide.when.event!=='inactive')||self.options.hide.when.event==='unfocus'){self.cache.toggle=0;showTarget.bind(self.options.show.when.event+'.qtip',function(event){if(self.cache.toggle===0){showMethod(event);}
else{hideMethod(event);}});}
else{showTarget.bind(self.options.show.when.event+'.qtip',showMethod);if(self.options.hide.when.event!=='inactive'){hideTarget.bind(self.options.hide.when.event+'.qtip',hideMethod);}}
if((/(fixed|absolute)/).test(self.options.position.type)){self.elements.tooltip.bind('mouseover.qtip',self.focus);}}
function bgiframe(){var self,html,dimensions;self=this;dimensions=self.getDimensions();html='<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:false" '+'style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=\'0\'); border: 1px solid red; '+'height:'+dimensions.height+'px; width:'+dimensions.width+'px" />';self.elements.bgiframe=self.elements.wrapper.prepend(html).children('.qtip-bgiframe:first');}
function construct(){var self,content,url,data,method;self=this;self.beforeRender.call(self);self.status.rendered=2;self.elements.tooltip='<div qtip="'+self.id+'" id="qtip-'+self.id+'" role="tooltip" '+'aria-describedby="qtip-'+self.id+'-content" class="qtip '+(self.options.style.classes.tooltip||self.options.style)+'" '+'style="display:none; -moz-border-radius:0; -webkit-border-radius:0; border-radius:0; position:'+self.options.position.type+';"> '+'  <div class="qtip-wrapper" style="position:relative; overflow:hidden; text-align:left;"> '+'    <div class="qtip-contentWrapper" style="overflow:hidden;"> '+'       <div id="qtip-'+self.id+'-content" class="qtip-content '+self.options.style.classes.content+'"></div> '+'</div></div></div>';self.elements.tooltip=$(self.elements.tooltip);self.elements.tooltip.appendTo(self.options.position.container);self.elements.tooltip.data('qtip',{current:0,interfaces:[self]});self.elements.wrapper=self.elements.tooltip.children('div:first');self.elements.contentWrapper=self.elements.wrapper.children('div:first');self.elements.content=self.elements.contentWrapper.children('div:first').css(jQueryStyle(self.options.style));if($.browser.msie){self.elements.wrapper.add(self.elements.content).css({zoom:1});}
if(self.options.hide.when.event==='unfocus'){self.elements.tooltip.attr('unfocus',true);}
if(typeof self.options.style.width.value==='number'){self.updateWidth();}
if($('<canvas />').get(0).getContext||$.browser.msie){if(self.options.style.border.radius>0){createBorder.call(self);}
else{self.elements.contentWrapper.css({border:self.options.style.border.width+'px solid '+self.options.style.border.color});}
if(self.options.style.tip.corner!==false){createTip.call(self);}}
else{self.elements.contentWrapper.css({border:self.options.style.border.width+'px solid '+self.options.style.border.color});self.options.style.border.radius=0;self.options.style.tip.corner=false;}
if((typeof self.options.content.text==='string'&&self.options.content.text.length>0)||(self.options.content.text.jquery&&self.options.content.text.length>0)){content=self.options.content.text;}
else{content=' ';}
if(self.options.content.title.text!==false){createTitle.call(self);}
self.updateContent(content,false);assignEvents.call(self);if(self.options.show.ready===true){self.show();}
if(self.options.content.url!==false){url=self.options.content.url;data=self.options.content.data;method=self.options.content.method||'get';self.loadContent(url,data,method);}
self.status.rendered=true;self.onRender.call(self);}
function QTip(target,options,id){var self=this;self.id=id;self.options=options;self.status={animated:false,rendered:false,disabled:false,focused:false};self.elements={target:target.addClass(self.options.style.classes.target),tooltip:null,wrapper:null,content:null,contentWrapper:null,title:null,button:null,tip:null,bgiframe:null};self.cache={attr:false,mouse:{},toggle:0,overflow:{left:false,top:false}};self.timers={};$.extend(self,self.options.api,{show:function(event){var returned,solo;if(!self.status.rendered){return false;}
if(self.elements.tooltip.css('display')!=='none'){return self;}
self.elements.tooltip.stop(true,false);returned=self.beforeShow.call(self,event);if(returned===false){return self;}
function afterShow(){self.elements.tooltip.attr('aria-hidden',true);if(self.options.position.type!=='static'){self.focus();}
self.onShow.call(self,event);if($.browser.msie){var ieStyle=self.elements.tooltip.get(0).style;ieStyle.removeAttribute('filter');ieStyle.removeAttribute('opacity');}
else{self.elements.tooltip.css({opacity:''});}}
self.cache.toggle=1;if(self.options.position.type!=='static'){self.updatePosition(event,(self.options.show.effect.length>0&&self.rendered!==2&&self.options.show.effect.type=='swing'));}
if(typeof self.options.show.solo==='object'){solo=$(self.options.show.solo);}
else if(self.options.show.solo===true){solo=$('div.qtip').not(self.elements.tooltip);}
if(solo){solo.each(function(){if($(this).qtip('api').status.rendered===true){$(this).qtip('api').hide();}});}
if(typeof self.options.show.effect.type==='function'){self.options.show.effect.type.call(self.elements.tooltip,self.options.show.effect.length);self.elements.tooltip.queue(function(){afterShow();$(this).dequeue();});}
else{switch(self.options.show.effect.type.toLowerCase()){case'fade':self.elements.tooltip.fadeIn(self.options.show.effect.length,afterShow);break;case'slide':self.elements.tooltip.slideDown(self.options.show.effect.length,function(){afterShow();if(self.options.position.type!=='static'){self.updatePosition(event,true);}});break;case'grow':self.elements.tooltip.show(self.options.show.effect.length,afterShow);break;default:self.elements.tooltip.show(null,afterShow);break;}
self.elements.tooltip.addClass(self.options.style.classes.active);}
return self;},hide:function(event){var returned;if(!self.status.rendered){return false;}
else if(self.elements.tooltip.css('display')==='none'){return self;}
clearTimeout(self.timers.show);self.elements.tooltip.stop(true,false);returned=self.beforeHide.call(self,event);if(returned===false){return self;}
function afterHide(){self.elements.tooltip.attr('aria-hidden',true);if($.browser.msie){self.elements.tooltip.get(0).style.removeAttribute('opacity');}
else{self.elements.tooltip.css({opacity:''});}
self.onHide.call(self,event);}
self.cache.toggle=0;if(typeof self.options.hide.effect.type==='function'){self.options.hide.effect.type.call(self.elements.tooltip,self.options.hide.effect.length);self.elements.tooltip.queue(function(){afterHide();$(this).dequeue();});}
else{switch(self.options.hide.effect.type.toLowerCase()){case'fade':self.elements.tooltip.fadeOut(self.options.hide.effect.length,afterHide);break;case'slide':self.elements.tooltip.slideUp(self.options.hide.effect.length,afterHide);break;case'grow':self.elements.tooltip.hide(self.options.hide.effect.length,afterHide);break;default:self.elements.tooltip.hide(null,afterHide);break;}
self.elements.tooltip.removeClass(self.options.style.classes.active);}
return self;},toggle:function(event,state){var condition=/boolean|number/.test(typeof state)?state:!self.elements.tooltip.is(':visible');self[condition?'show':'hide'](event);return self;},updatePosition:function(event,animate){if(!self.status.rendered){return false;}
var posOptions=options.position,target=$(posOptions.target),elemWidth=self.elements.tooltip.outerWidth(),elemHeight=self.elements.tooltip.outerHeight(),targetWidth,targetHeight,position,my=posOptions.corner.tooltip,at=posOptions.corner.target,returned,coords,i,mapName,imagePos,adapt={left:function(){var leftEdge=$(window).scrollLeft(),rightEdge=$(window).width()+$(window).scrollLeft(),myOffset=my.x==='center'?elemWidth/2:elemWidth,atOffset=my.x==='center'?targetWidth/2:targetWidth,borderAdjust=(my.x==='center'?1:2)*self.options.style.border.radius,offset=-2*posOptions.adjust.x,pRight=position.left+elemWidth,adj;if(pRight>rightEdge){adj=offset-myOffset-atOffset+borderAdjust;if(position.left+adj>leftEdge||leftEdge-(position.left+adj)<pRight-rightEdge){return{adjust:adj,tip:'right'};}}
if(position.left<leftEdge){adj=offset+myOffset+atOffset-borderAdjust;if(pRight+adj<rightEdge||pRight+adj-rightEdge<leftEdge-position.left){return{adjust:adj,tip:'left'};}}
return{adjust:0,tip:my.x};},top:function(){var topEdge=$(window).scrollTop(),bottomEdge=$(window).height()+$(window).scrollTop(),myOffset=my.y==='center'?elemHeight/2:elemHeight,atOffset=my.y==='center'?targetHeight/2:targetHeight,borderAdjust=(my.y==='center'?1:2)*self.options.style.border.radius,offset=-2*posOptions.adjust.y,pBottom=position.top+elemHeight,adj;if(pBottom>bottomEdge){adj=offset-myOffset-atOffset+borderAdjust;if(position.top+adj>topEdge||topEdge-(position.top+adj)<pBottom-bottomEdge){return{adjust:adj,tip:'bottom'};}}
if(position.top<topEdge){adj=offset+myOffset+atOffset-borderAdjust;if(pBottom+adj<bottomEdge||pBottom+adj-bottomEdge<topEdge-position.top){return{adjust:adj,tip:'top'};}}
return{adjust:0,tip:my.y};}};if(event&&options.position.target==='mouse'){at={x:'left',y:'top'};targetWidth=targetHeight=0;if(!event.pageX){position=self.cache.mouse;}
else{position={top:event.pageY,left:event.pageX};}}
else{if(target[0]===document){targetWidth=target.width();targetHeight=target.height();position={top:0,left:0};}
else if(target[0]===window){targetWidth=target.width();targetHeight=target.height();position={top:target.scrollTop(),left:target.scrollLeft()};}
else if(target.is('area')){coords=self.options.position.target.attr('coords').split(',');for(i=0;i<coords.length;i++){coords[i]=parseInt(coords[i],10);}
mapName=self.options.position.target.parent('map').attr('name');imagePos=$('img[usemap="#'+mapName+'"]:first').offset();position={left:Math.floor(imagePos.left+coords[0]),top:Math.floor(imagePos.top+coords[1])};switch(self.options.position.target.attr('shape').toLowerCase()){case'rect':targetWidth=Math.ceil(Math.abs(coords[2]-coords[0]));targetHeight=Math.ceil(Math.abs(coords[3]-coords[1]));break;case'circle':targetWidth=coords[2]+1;targetHeight=coords[2]+1;break;case'poly':targetWidth=coords[0];targetHeight=coords[1];for(i=0;i<coords.length;i++){if(i%2===0){if(coords[i]>targetWidth){targetWidth=coords[i];}
if(coords[i]<coords[0]){position.left=Math.floor(imagePos.left+coords[i]);}}
else{if(coords[i]>targetHeight){targetHeight=coords[i];}
if(coords[i]<coords[1]){position.top=Math.floor(imagePos.top+coords[i]);}}}
targetWidth=targetWidth-(position.left-imagePos.left);targetHeight=targetHeight-(position.top-imagePos.top);break;}
targetWidth-=2;targetHeight-=2;}
else{targetWidth=target.outerWidth();targetHeight=target.outerHeight();if(!self.elements.tooltip.is(':visible')){self.elements.tooltip.css({left:'-10000000em'}).show();}
if(!posOptions.adjust.offset||self.elements.tooltip.offsetParent()[0]===document.body){position=target.offset();}
else{position=target.position();position.top+=target.offsetParent().scrollTop();position.left+=target.offsetParent().scrollLeft();}}
position.left+=at.x==='right'?targetWidth:at.x==='center'?targetWidth/2:0;position.top+=at.y==='bottom'?targetHeight:at.y==='center'?targetHeight/2:0;}
position.left+=posOptions.adjust.x+(my.x==='right'?-elemWidth:my.x==='center'?-elemWidth/2:0);position.top+=posOptions.adjust.y+(my.y==='bottom'?-elemHeight:my.y==='center'?-elemHeight/2:0);if(self.options.style.border.radius>0){if(my.x==='left'){position.left-=self.options.style.border.radius;}
else if(my.x==='right'){position.left+=self.options.style.border.radius;}
if(my.y==='top'){position.top-=self.options.style.border.radius;}
else if(my.y==='bottom'){position.top+=self.options.style.border.radius;}}
if(posOptions.adjust.screen){(function(){var adjusted={x:0,y:0},adapted={x:adapt.left(),y:adapt.top()},tip=new Corner(options.style.tip.corner);if(self.elements.tip&&tip){if(adapted.y.adjust!==0){position.top+=adapted.y.adjust;tip.y=adjusted.y=adapted.y.tip;}
if(adapted.x.adjust!==0){position.left+=adapted.x.adjust;tip.x=adjusted.x=adapted.x.tip;}
self.cache.overflow={left:adjusted.x===false,top:adjusted.y===false};if(self.elements.tip.attr('rel')!==tip.string()){createTip.call(self,tip);}}}());}
if(!self.elements.bgiframe&&$.browser.msie&&parseInt($.browser.version.charAt(0),10)===6){bgiframe.call(self);}
returned=self.beforePositionUpdate.call(self,event);if(returned===false){return self;}
self.elements.tooltip.hide();if(options.position.target!=='mouse'&&animate===true){self.status.animated=true;self.elements.tooltip.stop().animate(position,200,'swing',function(){self.status.animated=false;});}
else{self.elements.tooltip.css(position);}
self.onPositionUpdate.call(self,event);return self;},updateWidth:function(newWidth){if(!self.status.rendered||(newWidth&&typeof newWidth!=='number')){return false;}
var hidden=self.elements.contentWrapper.siblings().add(self.elements.tip).add(self.elements.button),zoom=self.elements.wrapper.add(self.elements.contentWrapper.children()),tooltip=self.elements.tooltip,max=self.options.style.width.max,min=self.options.style.width.min;if(!newWidth){if(typeof self.options.style.width.value==='number'){newWidth=self.options.style.width.value;}
else{self.elements.tooltip.css({width:'auto'});hidden.hide();tooltip.width(newWidth);if($.browser.msie){zoom.css({zoom:''});}
newWidth=self.getDimensions().width;if(!self.options.style.width.value){newWidth=Math.min(Math.max(newWidth,min),max);}}}
if(newWidth%2){newWidth+=1;}
self.elements.tooltip.width(newWidth);hidden.show();if(self.options.style.border.radius){self.elements.tooltip.find('.qtip-betweenCorners').each(function(i){$(this).width(newWidth-(self.options.style.border.radius*2));});}
if($.browser.msie){zoom.css({zoom:1});self.elements.wrapper.width(newWidth);if(self.elements.bgiframe){self.elements.bgiframe.width(newWidth).height(self.getDimensions.height);}}
return self;},updateStyle:function(name){var tip,borders,context,corner,coordinates;if(!self.status.rendered||typeof name!=='string'||!$.fn.qtip.styles[name]){return false;}
self.options.style=buildStyle.call(self,$.fn.qtip.styles[name],self.options.user.style);self.elements.content.css(jQueryStyle(self.options.style));if(self.options.content.title.text!==false){self.elements.title.css(jQueryStyle(self.options.style.title,true));}
self.elements.contentWrapper.css({borderColor:self.options.style.border.color});if(self.options.style.tip.corner!==false){if($('<canvas />').get(0).getContext){tip=self.elements.tooltip.find('.qtip-tip canvas:first');context=tip.get(0).getContext('2d');context.clearRect(0,0,300,300);corner=tip.parent('div[rel]:first').attr('rel');coordinates=calculateTip(corner,self.options.style.tip.size.width,self.options.style.tip.size.height);drawTip.call(self,tip,coordinates,self.options.style.tip.color||self.options.style.border.color);}
else if($.browser.msie){tip=self.elements.tooltip.find('.qtip-tip [nodeName="shape"]');tip.attr('fillcolor',self.options.style.tip.color||self.options.style.border.color);}}
if(self.options.style.border.radius>0){self.elements.tooltip.find('.qtip-betweenCorners').css({backgroundColor:self.options.style.border.color});if($('<canvas />').get(0).getContext){borders=calculateBorders(self.options.style.border.radius);self.elements.tooltip.find('.qtip-wrapper canvas').each(function(){context=$(this).get(0).getContext('2d');context.clearRect(0,0,300,300);corner=$(this).parent('div[rel]:first').attr('rel');drawBorder.call(self,$(this),borders[corner],self.options.style.border.radius,self.options.style.border.color);});}
else if($.browser.msie){self.elements.tooltip.find('.qtip-wrapper [nodeName="arc"]').each(function(){$(this).attr('fillcolor',self.options.style.border.color);});}}
return self;},updateContent:function(content,reposition){var parsedContent,images,loadedImages;function afterLoad(){self.updateWidth();if(reposition!==false){if(self.options.position.type!=='static'){self.updatePosition(self.elements.tooltip.is(':visible'),true);}
if(self.options.style.tip.corner!==false){positionTip.call(self);}}}
if(!content){return false;}
parsedContent=self.beforeContentUpdate.call(self,content);if(typeof parsedContent==='string'){content=parsedContent;}
else if(parsedContent===false){return;}
if(self.status.rendered){if($.browser.msie){self.elements.contentWrapper.children().css({zoom:'normal'});}
if(content.jquery&&content.length>0){content.clone(true).appendTo(self.elements.content).show();}
else{self.elements.content.html(content);}
images=self.elements.content.find('img[complete=false]');if(images.length>0){loadedImages=0;images.each(function(i){$('<img src="'+$(this).attr('src')+'" />').load(function(){if(++loadedImages===images.length){afterLoad();}});});}
else{afterLoad();}}
else{self.options.content.text=content;}
self.onContentUpdate.call(self);return self;},loadContent:function(url,data,method){var returned;function setupContent(content){self.onContentLoad.call(self);self.updateContent(content);}
if(!self.status.rendered){return false;}
returned=self.beforeContentLoad.call(self);if(returned===false){return self;}
if(method==='post'){$.post(url,data,setupContent);}
else{$.get(url,data,setupContent);}
return self;},updateTitle:function(content){var returned;if(!self.status.rendered||!content){return false;}
returned=self.beforeTitleUpdate.call(self);if(returned===false){return self;}
if(self.elements.button){self.elements.button=self.elements.button.clone(true);}
self.elements.title.html(content);if(self.elements.button){self.elements.title.prepend(self.elements.button);}
self.onTitleUpdate.call(self);return self;},focus:function(event){var curIndex,newIndex,elemIndex,returned;if(!self.status.rendered||self.options.position.type==='static'){return false;}
curIndex=parseInt(self.elements.tooltip.css('z-index'),10);newIndex=15000+$('div.qtip[id^="qtip"]').length-1;if(!self.status.focused&&curIndex!==newIndex){returned=self.beforeFocus.call(self,event);if(returned===false){return self;}
$('div.qtip[id^="qtip"]').not(self.elements.tooltip).each(function(){if($(this).qtip('api').status.rendered===true){elemIndex=parseInt($(this).css('z-index'),10);if(typeof elemIndex==='number'&&elemIndex>-1){$(this).css({zIndex:parseInt($(this).css('z-index'),10)-1});}
$(this).qtip('api').status.focused=false;}});self.elements.tooltip.css({zIndex:newIndex});self.status.focused=true;self.onFocus.call(self,event);}
return self;},disable:function(state){self.status.disabled=state?true:false;return self;},destroy:function(){var i,returned,interfaces,oldattr=self.elements.target.data('old'+self.cache.attr[0]);returned=self.beforeDestroy.call(self);if(returned===false){return self;}
if(self.status.rendered){self.options.show.when.target.unbind('mousemove.qtip',self.updatePosition);self.options.show.when.target.unbind('mouseout.qtip',self.hide);self.options.show.when.target.unbind(self.options.show.when.event+'.qtip');self.options.hide.when.target.unbind(self.options.hide.when.event+'.qtip');self.elements.tooltip.unbind(self.options.hide.when.event+'.qtip');self.elements.tooltip.unbind('mouseover.qtip',self.focus);self.elements.tooltip.remove();}
else{self.options.show.when.target.unbind(self.options.show.when.event+'.qtip-'+self.id+'-create');}
if(typeof self.elements.target.data('qtip')==='object'){interfaces=self.elements.target.data('qtip').interfaces;if(typeof interfaces==='object'&&interfaces.length>0){for(i=0;i<interfaces.length-1;i++){if(interfaces[i].id===self.id){interfaces.splice(i,1);}}}}
$.fn.qtip.interfaces.splice(self.id,1);if(typeof interfaces==='object'&&interfaces.length>0){self.elements.target.data('qtip').current=interfaces.length-1;}
else{self.elements.target.removeData('qtip');}
if(oldattr){self.elements.target.attr(self.cache.attr[0],oldattr);}
self.onDestroy.call(self);return self.elements.target;},getPosition:function(){var show,offset;if(!self.status.rendered){return false;}
show=(self.elements.tooltip.css('display')!=='none')?false:true;if(show){self.elements.tooltip.css({visiblity:'hidden'}).show();}
offset=self.elements.tooltip.offset();if(show){self.elements.tooltip.css({visiblity:'visible'}).hide();}
return offset;},getDimensions:function(){var show,dimensions;if(!self.status.rendered){return false;}
show=(!self.elements.tooltip.is(':visible'))?true:false;if(show){self.elements.tooltip.css({visiblity:'hidden'}).show();}
dimensions={height:self.elements.tooltip.outerHeight(),width:self.elements.tooltip.outerWidth()};if(show){self.elements.tooltip.css({visiblity:'visible'}).hide();}
return dimensions;}});}
$.fn.qtip=function(options,blanket){var i,id,interfaces,opts,obj,command,config,api;if(typeof options==='string'){if($(this).data('qtip')){if(options==='api'){return $(this).data('qtip').interfaces[$(this).data('qtip').current];}
else if(options==='interfaces'){return $(this).data('qtip').interfaces;}}
else{return $(this);}}
else{if(!options){options={};}
if(typeof options.content!=='object'||(options.content.jquery&&options.content.length>0)){options.content={text:options.content};}
if(typeof options.content.title!=='object'){options.content.title={text:options.content.title};}
if(typeof options.position!=='object'){options.position={corner:options.position};}
if(typeof options.position.corner!=='object'){options.position.corner={target:options.position.corner,tooltip:options.position.corner};}
if(typeof options.show!=='object'){options.show={when:options.show};}
if(typeof options.show.when!=='object'){options.show.when={event:options.show.when};}
if(typeof options.show.effect!=='object'){options.show.effect={type:options.show.effect};}
if(typeof options.hide!=='object'){options.hide={when:options.hide};}
if(typeof options.hide.when!=='object'){options.hide.when={event:options.hide.when};}
if(typeof options.hide.effect!=='object'){options.hide.effect={type:options.hide.effect};}
if(typeof options.style!=='object'){options.style={name:options.style};}
options.style=sanitizeStyle(options.style);opts=$.extend(true,{},$.fn.qtip.defaults,options);opts.style=buildStyle.call({options:opts},opts.style);opts.user=$.extend(true,{},options);}
return $(this).each(function()
{var self=$(this),content=false;if(typeof options==='string'){command=options.toLowerCase();interfaces=$(this).qtip('interfaces');if(typeof interfaces==='object'){if(blanket===true&&command==='destroy'){for(i=interfaces.length-1;i>-1;i--){if('object'===typeof interfaces[i]){interfaces[i].destroy();}}}
else{if(blanket!==true){interfaces=[$(this).qtip('api')];}
for(i=0;i<interfaces.length;i++){if(command==='destroy'){interfaces[i].destroy();}
else if(interfaces[i].status.rendered===true){if(command==='show'){interfaces[i].show();}
else if(command==='hide'){interfaces[i].hide();}
else if(command==='focus'){interfaces[i].focus();}
else if(command==='disable'){interfaces[i].disable(true);}
else if(command==='enable'){interfaces[i].disable(false);}
else if(command==='update'){interfaces[i].updatePosition();}}}}}}
else{config=$.extend(true,{},opts);config.hide.effect.length=opts.hide.effect.length;config.show.effect.length=opts.show.effect.length;if(config.position.container===false){config.position.container=$(document.body);}
if(config.position.target===false){config.position.target=$(this);}
if(config.show.when.target===false){config.show.when.target=$(this);}
if(config.hide.when.target===false){config.hide.when.target=$(this);}
config.position.corner.tooltip=new Corner(config.position.corner.tooltip);config.position.corner.target=new Corner(config.position.corner.target);if(!config.content.text.length){$(['title','alt']).each(function(i,attr){var val=self.prop(attr);if(val&&val.length){content=[attr,val];self.data('old'+attr,val).removeAttr(attr);config.content.text=val.replace(/\n/gi,'<br />');return false;}});}
id=$.fn.qtip.interfaces.length;for(i=0;i<id;i++){if(typeof $.fn.qtip.interfaces[i]==='undefined'){id=i;break;}}
obj=new QTip($(this),config,id);$.fn.qtip.interfaces[id]=obj;obj.cache.attr=content;if(typeof $(this).data('qtip')==='object'&&$(this).data('qtip')){if(typeof $(this).attr('qtip')==='undefined'){$(this).data('qtip').current=$(this).data('qtip').interfaces.length;}
$(this).data('qtip').interfaces.push(obj);}
else{$(this).data('qtip',{current:0,interfaces:[obj]});}
if(config.content.prerender===false&&config.show.when.event!==false&&config.show.ready!==true){config.show.when.target.bind(config.show.when.event+'.qtip-'+id+'-create',{qtip:id},function(event){api=$.fn.qtip.interfaces[event.data.qtip];api.options.show.when.target.unbind(api.options.show.when.event+'.qtip-'+event.data.qtip+'-create');api.cache.mouse={left:event.pageX,top:event.pageY};construct.call(api);api.options.show.when.target.trigger(api.options.show.when.event);});}
else{obj.cache.mouse={left:config.show.when.target.offset().left,top:config.show.when.target.offset().top};construct.call(obj);}}});};$.fn.qtip.interfaces=[];$.fn.qtip.fn={attr:$.fn.attr};$.fn.attr=function(attr){var api=$(this).qtip('api');return(arguments.length===1&&(/title|alt/i).test(attr)&&api.status&&api.status.rendered===true)?$(this).data('old'+api.cache.attr[0]):$.fn.qtip.fn.attr.apply(this,arguments);};$.fn.qtip.defaults={content:{prerender:false,text:false,url:false,data:null,title:{text:false,button:false}},position:{target:false,corner:{target:'bottomRight',tooltip:'topLeft'},adjust:{x:0,y:-10,mouse:true,screen:false,scroll:true,resize:true,offset:false},type:'absolute',container:false},show:{when:{target:false,event:'mouseover'},effect:{type:'fade',length:100},delay:140,solo:false,ready:false},hide:{when:{target:false,event:'mouseout'},effect:{type:'fade',length:100},delay:0,fixed:false},api:{beforeRender:function(){},onRender:function(){},beforePositionUpdate:function(){},onPositionUpdate:function(){},beforeShow:function(){},onShow:function(){},beforeHide:function(){},onHide:function(){},beforeContentUpdate:function(){},onContentUpdate:function(){},beforeContentLoad:function(){},onContentLoad:function(){},beforeTitleUpdate:function(){},onTitleUpdate:function(){},beforeDestroy:function(){},onDestroy:function(){},beforeFocus:function(){},onFocus:function(){}}};$.fn.qtip.styles={defaults:{background:'white',color:'#111',overflow:'hidden',textAlign:'left',width:{min:0,max:250},padding:'5px 9px',border:{width:1,radius:0,color:'#d3d3d3'},tip:{corner:false,color:false,size:{width:13,height:13},opacity:1},title:{background:'#e1e1e1',fontWeight:'bold',padding:'7px 12px'},button:{cursor:'pointer'},classes:{target:'',tip:'qtip-tip',title:'qtip-title',button:'qtip-button',content:'qtip-content',active:'qtip-active'}},cream:{border:{width:3,radius:0,color:'#F9E98E'},title:{background:'#F0DE7D',color:'#A27D35'},background:'#FBF7AA',color:'#A27D35',classes:{tooltip:'qtip-cream'}},light:{border:{width:3,radius:0,color:'#E2E2E2'},title:{background:'#f1f1f1',color:'#454545'},background:'white',color:'#454545',classes:{tooltip:'qtip-light'}},dark:{border:{width:3,radius:0,color:'#303030'},title:{background:'#404040',color:'#f3f3f3'},background:'#505050',color:'#f3f3f3',classes:{tooltip:'qtip-dark'}},red:{border:{width:3,radius:0,color:'#CE6F6F'},title:{background:'#f28279',color:'#9C2F2F'},background:'#F79992',color:'#9C2F2F',classes:{tooltip:'qtip-red'}},green:{border:{width:3,radius:0,color:'#A9DB66'},title:{background:'#b9db8c',color:'#58792E'},background:'#CDE6AC',color:'#58792E',classes:{tooltip:'qtip-green'}},blue:{border:{width:3,radius:0,color:'#ADD9ED'},title:{background:'#D0E9F5',color:'#5E99BD'},background:'#E5F6FE',color:'#4D9FBF',classes:{tooltip:'qtip-blue'}},ef:{border:{width:3,radius:10,color:'#2b2627'},title:{background:'#f1f1f1',color:'#454545'},tip:{size:{x:20,y:8}},background:'#2b2627',color:'white',classes:{tooltip:'qtip-ef'}}};}(jQuery));