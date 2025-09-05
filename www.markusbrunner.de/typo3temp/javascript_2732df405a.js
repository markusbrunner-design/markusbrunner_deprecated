(function($){var powermail_customValidatorConfiguration = {			position: 'top right',
			offset: [-5, -20],
            message: '<div><em/></div>'};$.tools.validator.localize('en', {'*': 'Bitte korrigieren Sie diesen Wert','[required]': 'Das ist ein Pflichtfeld',':email': 'Bitte tragen Sie eine gültige E-Mail Adresse ein (test@test.de)',':url': 'Bitte tragen Sie eine gültige URL ein (http://www.test.de)',':number': 'Bitte tragen Sie eine Nummer ein',':digits': 'Bitte tragen Sie eine Nummer ohne Komma oder Punkt ein',':username': 'Bitte nutzen Sie hier nur Buchstaben (a-z) oder Zahlen (0-9) nur in diesem Feld. Leer- oder andere Zeichen sind nicht erlaubt',':date': 'Bitte tragen Sie ein korrektes Datum ein',':datetime': 'Bitte tragen Sie ein korrektes Datum sowie Uhrzeit ein',':time': 'Ungültige Zeit','[max]': 'Bitte geben Sie einen Wert grösser als $1 ein','[min]': 'Bitte geben Sie einen Wert kleiner als $1 ein'});$.tools.dateinput.localize('en', {'months': 'Januar,Februar,März,April,Mai,Juni,July,August,September,Oktober,November,Dezember','shortMonths': 'Jan,Feb,Mrz,Apr,Mai,Jun,Jul,Aug,Sep,Okt,Nov,Dez','days': 'Sonntag,Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag','shortDays': 'So,Mo,Di,Mi,Do,Fr,Sa'});$(function(){$(':date').dateinput({format: 'dd.mm.yyyy',firstDay:1,
                selectors: true,
                disabled: false,
                readonly: false,
                yearRange: [-99, 99],
                change: function(event, date){
                    timestampOfDate = new Date(this.getValue('yyyy,m,d')).getTime() / 1000;
                    oldTimestamp = this.getInput().nextAll('input[type=hidden]').val();
                    if(this.getInput().nextAll('input[type=time]').length > 0 && oldTimestamp != '' && parseInt(oldTimestamp) == oldTimestamp) {
                        oldDate = new Date(oldTimestamp * 1000);
                        h = oldDate.getHours();
                        m = oldDate.getMinutes();
                        timestampOfDate += h * 3600 + m * 60;
                    }
                    this.getInput().nextAll('input[type=hidden]').val(timestampOfDate);
                }
            }).each(function(i){
                initTimestamp = $(this).nextAll('input[type=hidden]').val();
                if(initTimestamp != '' && parseInt(initTimestamp) == initTimestamp) {
                    $(this).data('dateinput').setValue(new Date(parseInt(initTimestamp)*1000));
                }});        
        $.tools.validator.fn('input:checkbox', 'required',
            function(input, value) {
                checkboxes = input.parent().parent().find('input:checkbox');
                if (checkboxes.filter('.required_one').length > 0) {
                    if (checkboxes.filter(':checked').length == 0) {
                        return (input.filter('.required_one').length == 0);
                    } else {
                        powermail_validator.data('validator').reset(checkboxes);
                    }
                }
                return true;
            });
$.tools.validator.localizeFn('input:time', { en: 'Ungültige Zeit'});$.tools.validator.localizeFn('input:checkbox', { en: 'Bitte treffen Sie eine Auswahl'});$.tools.validator.localizeFn('input:radio', { en: 'Bitte treffen Sie eine Auswahl'});$.tools.validator.localizeFn('input:select.required', { en: 'Das ist ein Pflichtfeld'});
        powermail_validator = $('.tx_powermail_pi1_form').validator($.extend({
           inputEvent: 'blur',
           grouped: true,
           singleError: false,
           onBeforeValidate: function(e, els) {
               clearPlaceholderValue(e, els);
           },
           onBeforeFail: function(e, els, matcher) {
               setPlaceholderValue(e, els, matcher);
           }
        }, powermail_customValidatorConfiguration));
});})(jQuery);