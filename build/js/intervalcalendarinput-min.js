(function(){var G=YAHOO.lang,C=YAHOO.util.Dom,A=YAHOO.util.Event,B=YAHOO.util.Element,F=YAHOO.widget.DateMath,H=YAHOO.BLARGON.widget.IntervalCalendar;function E(J,I){I=I||{};E.superclass.constructor.call(this,J,I);this.ical=new H(J,I);this._dateRegExp=this._getDateRegExp();this._lower=C.get(this.get(D.LOWER_INPUT.key));this._upper=C.get(this.get(D.UPPER_INPUT.key));this.initEvents();this.sync()}E._DEFAULT_CONFIG={LOWER_INPUT:{key:"lower_input",value:null},UPPER_INPUT:{key:"upper_input",value:null}};var D=E._DEFAULT_CONFIG;G.extend(E,B,{initAttributes:function(I){E.superclass.initAttributes.call(this,I);this.setAttributeConfig(D.LOWER_INPUT.key,{value:D.LOWER_INPUT.value});this.setAttributeConfig(D.UPPER_INPUT.key,{value:D.UPPER_INPUT.value});this.setAttributes(I,true)},initEvents:function(){var I=this.ical,J=this._lower,K=this._upper;I.selectEvent.subscribe(this._onIntervalSelect,this,true);A.on([J,K],"keyup",this._onInputKeyup,this,true)},_getDateRegExp:function(){var J=this.ical,I=[],K;I[J.cfg.getProperty("mdy_year_position")-1]="([0-9]{4})";I[J.cfg.getProperty("mdy_month_position")-1]="([0-9]{1,2})";I[J.cfg.getProperty("mdy_day_position")-1]="([0-9]{1,2})";K=J.cfg.getProperty("date_field_delimiter").charCodeAt(0).toString(16);return new RegExp("^"+I.join("\\x"+K)+"$")},_getDateString:function(I){return this.ical._dateString(I)},_parseDate:function(M){var N=this._dateRegExp,I=N.exec(M);if(I){var J=this.ical,L=parseInt(I[J.cfg.getProperty("mdy_year_position")],10),O=parseInt(I[J.cfg.getProperty("mdy_month_position")],10)-1,K=parseInt(I[J.cfg.getProperty("mdy_day_position")],10);if(0<=L&&L<100){L+=2000}return F.getDate(L,O,K)}else{return null}},render:function(){this.ical.render()},show:function(){this.ical.show()},hide:function(){this.ical.hide()},sync:function(){var J=this.ical,N=J.pages[0],I=this._lower.value,P=this._upper.value,M=this._dateRegExp,L=true;if(M.test(I)&&M.test(P)){var K=this._parseDate(I),O=this._parseDate(P);if(K.getTime()<=O.getTime()&&!N.isDateOOB(K)&&!N.isDateOOB(O)){J.setInterval(K,O);J.cfg.setProperty("pagedate",K);L=false}}if(L){J.resetInterval()}J.render()},reset:function(){var I=this.ical,J=this._lower,K=this._upper;J.value="";K.value="";I.resetInterval();I.render()},_onIntervalSelect:function(){var K=this.ical.getInterval();if(K.length!==0){var J=this._lower,L=this._upper,I=K[0],M=K[1];J.value=this._getDateString(I);L.value=this._getDateString(M)}},_onInputKeyup:function(){this.sync()}});YAHOO.namespace("BLARGON.widget");YAHOO.BLARGON.widget.IntervalCalendarInput=E})();