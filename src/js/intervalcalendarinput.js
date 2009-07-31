/**
 * IntervalCalendarInput connects an IntervalCalendar instance with two text
 * input fields containing to the lower and upper dates of the interval.
 *
 * @module intervalcalendarinput
 * @requires yahoo, dom, event, element, calendar, intervalcalendar
 */
(function() {
	// Shortcuts
	var Lang = YAHOO.lang,
		Dom = YAHOO.util.Dom,
		Event = YAHOO.util.Event,
		Element = YAHOO.util.Element,
		DateMath = YAHOO.widget.DateMath,
		IntervalCalendar = YAHOO.BLARGON.widget.IntervalCalendar;

	/**
	 * IntervalCalendarInput instantiates an IntervalCalendar and associates
	 * it with two specified input fields which contain the lower and upper
	 * dates of the interval. The states of the IntervalCalendar and text
	 * inputs are kept in sync as the user interacts.
	 * <p>The format of the date strings in the input fields depends on the
	 * localization settings of the IntervalCalendar instance.</p>
	 *
	 * @namespace YAHOO.BLARGON.widget
	 * @class IntervalCalendarInput
	 * @extends YAHOO.util.Element
	 * @constructor
	 * @param {String | HTMLElement} ctr Container element for IntervalCalendar
	 * @param {Object} cfg Configuration object (also applied to IntervalCalendar)
	 */
	function IntervalCalendarInput(ctr, cfg) {
		cfg = cfg || {};
		
		IntervalCalendarInput.superclass.constructor.call(this, ctr, cfg);
		
		this.ical = new IntervalCalendar(ctr, cfg);
		this._dateRegExp = this._getDateRegExp();
		this._lower = Dom.get(this.get(_CONFIG.LOWER_INPUT.key));
		this._upper = Dom.get(this.get(_CONFIG.UPPER_INPUT.key));
		
		this.initEvents();
		this.sync();
	}

	/**
	 * Default configuration values.
	 * @property _DEFAULT_CONFIG
	 * @private
	 * @static
	 * @final
	 * @type Object
	 */
	IntervalCalendarInput._DEFAULT_CONFIG = {
		LOWER_INPUT: { key: 'lower_input', value: null },
		UPPER_INPUT: { key: 'upper_input', value: null }
	};
	
	var _CONFIG = IntervalCalendarInput._DEFAULT_CONFIG;
	
	Lang.extend(IntervalCalendarInput, Element,
		{
			/**
			 * Initializes configuration attributes.
			 * @method initAttributes
			 * @param {Object} cfg Initial configuration object
			 */
			initAttributes: function(cfg) {
				IntervalCalendarInput.superclass.initAttributes.call(this, cfg);

				/**
				 * Input field for lower date. Must be set on instantiation.
				 * @attribute lower_input
				 * @type String | HTMLElement
				 * @default null
				 */
				this.setAttributeConfig(_CONFIG.LOWER_INPUT.key, { value: _CONFIG.LOWER_INPUT.value });

				/**
				 * Input field for upper date. Must be set on instantiation.
				 * @attribute upper_input
				 * @type String | HTMLElement
				 * @default null
				 */
				this.setAttributeConfig(_CONFIG.UPPER_INPUT.key, { value: _CONFIG.UPPER_INPUT.value });
				
				this.setAttributes(cfg, true);
			},

			/**
			 * Attaches event handlers.
			 * @method initEvents
			 */
			initEvents: function() {
				var ical = this.ical,
					lower = this._lower,
					upper = this._upper;
				
				ical.selectEvent.subscribe(this._onIntervalSelect, this, true);
				
				Event.on([lower, upper], 'keyup', this._onInputKeyup, this, true);
			},

			/**
			 * Constructs regular expression for date strings based on localization
			 * settings of IntervalCalendar.
			 * @method _getDateRegExp
			 * @private
			 * @return {RegExp} Regular expression object
			 */
			_getDateRegExp: function() {
				var ical = this.ical,
					fields = [],
					sep;
				
				fields[ical.cfg.getProperty('mdy_year_position') - 1] = '([0-9]{4})';
				fields[ical.cfg.getProperty('mdy_month_position') - 1] = '([0-9]{1,2})';
				fields[ical.cfg.getProperty('mdy_day_position') - 1] = '([0-9]{1,2})';
				sep = ical.cfg.getProperty('date_field_delimiter').charCodeAt(0).toString(16);
				
				return new RegExp('^' + fields.join('\\x' + sep) + '$');
			},

			/**
			 * Constructs localized date string from date object.
			 * @method _getDateString
			 * @private
			 * @param {Date} d Date object
			 * @return {String} String
			 */
			_getDateString: function(d) {
				return this.ical._dateString(d);
			},

			/**
			 * Parses localized date string into date object, if valid.
			 * @method _parseDate
			 * @private
			 * @param {String} s String
			 * @return {Date} A date object if string was valid; null otherwise.
			 */
			_parseDate: function(s) {
				var dateRegExp = this._dateRegExp,
					m = dateRegExp.exec(s);
				
				if(m) {
					var ical = this.ical,
						year = parseInt(m[ical.cfg.getProperty('mdy_year_position')], 10),
						month = parseInt(m[ical.cfg.getProperty('mdy_month_position')], 10) - 1,
						day = parseInt(m[ical.cfg.getProperty('mdy_day_position')], 10);
					
					if(0 <= year && year < 100) {
						year += 2000;
					}
					
					return DateMath.getDate(year, month, day);
				}
				else {
					return null;
				}
			},

			/**
			 * Renders IntervalCalendar.
			 * @method render
			 */
			render: function() { this.ical.render(); },

			/**
			 * Shows IntervalCalendar.
			 * @method show
			 */
			show: function() { this.ical.show(); },

			/**
			 * Hides IntervalCalendar.
			 * @method hide
			 */
			hide: function() { this.ical.hide(); },

			/**
			 * Synchronizes IntervalCalendar and input fields.
			 * @method sync
			 */
			sync: function() {
				var ical = this.ical,
					page = ical.pages[0],
					lowerValue = this._lower.value,
					upperValue = this._upper.value,
					dateRegExp = this._dateRegExp,
					reset = true;
				
				if(dateRegExp.test(lowerValue) && dateRegExp.test(upperValue)) {
					var lowerDate = this._parseDate(lowerValue),
						upperDate = this._parseDate(upperValue);
					
					if(lowerDate.getTime() <= upperDate.getTime()
						&& !page.isDateOOB(lowerDate) && !page.isDateOOB(upperDate))
					{
						ical.setInterval(lowerDate, upperDate);
						ical.cfg.setProperty('pagedate', lowerDate);
						reset = false;
					}
				}
				
				if(reset) {
					ical.resetInterval();
				}
				
				ical.render();
			},

			/**
			 * Resets IntervalCalendar and input fields.
			 * @method reset
			 */
			reset: function() {
				var ical = this.ical,
					lower = this._lower,
					upper = this._upper;
				
				lower.value = '';
				upper.value = '';
				ical.resetInterval();
				ical.render();
			},

			/**
			 * Handles IntervalCalendar selection event.
			 * @method _onIntervalSelect
			 * @private
			 */
			_onIntervalSelect: function() {
				var i = this.ical.getInterval();
				if(i.length !== 0) {
					var lower = this._lower,
						upper = this._upper,
						lowerDate = i[0],
						upperDate = i[1];
					
					lower.value = this._getDateString(lowerDate);
					upper.value = this._getDateString(upperDate);
				}
			},

			/**
			 * Handles input field keyup event.
			 * @method _onInputKeyup
			 * @private
			 */
			_onInputKeyup: function() {
				this.sync();
			}
		}
	);
	
	// Export
	YAHOO.namespace('BLARGON.widget');
	YAHOO.BLARGON.widget.IntervalCalendarInput = IntervalCalendarInput;
})();
