const TelegramBot = require('node-telegram-bot-api');
const apiai = require("./module/apiai");
const moment = require("./module/momentlocales");

const token = ' ';
const app = apiai(' ');

const fname = 'log.txt';

var bot = new TelegramBot(token, {polling: true});
var fs = require('fs');
var Data = new Date();

var request;
 
var ct;

moment.locale("ru");  
 
ct = String("Запуск бота от " + moment().format('DD.MM.YY', Data));
console.log(ct);
fs.appendFileSync(fname, '\r\n' + ct);

bot.on('message', function (msg){
    var chatId = msg.chat.id;
	
	var smilyface = "\uD83D\uDE03";
	var sadface = "\uD83D\uDE14";
	
	request = app.textRequest(msg.text, {sessionId: chatId});
	
	request.on('response', function(response) {
	
	function loging(){
	var ctlong="Разговор с ботом" + '\r\n';

	Data = new Date();
	ct = String(moment().format('HH:mm:ss', Data) + " id чата: " + msg.chat.id + ", Сообщение от " +  msg.chat.first_name + " " + msg.chat.last_name + ": \"" + msg.text + "\"");
	fs.appendFileSync(fname, '\r\n' + ct);
	console.log(ct);
	ctlong=ctlong+ct+'\r\n';
	
	Data = new Date();
	ct = String(moment().format('HH:mm:ss', Data) + " id чата: " + msg.chat.id + ", Ответ от Бота: \"" + s + "\" Тип сообщения: " + action);
	fs.appendFileSync(fname, '\r\n' + ct);
	console.log(ct);
	ctlong=ctlong+ct;
	bot.sendMessage(358701372, ctlong);
	}

    //console.log(response);
	
		function salaryDayCorrector(salaryDate){
		for (var i = 0; i < salaryDate.length; i++){
		if (moment(salaryDate[i]).day() == 7){
		salaryDate[i]=moment(salaryDate[i]).set('date', (moment(salaryDate[i]).get('date')-2) );
			}
		if (moment(salaryDate[i]).day() == 6){
		salaryDate[i]=moment(salaryDate[i]).set('date', (moment(salaryDate[i]).get('date')-1));
			}
		}
		return salaryDate;
	}
			
		function checker(currentDate){
			
			var salaryDate = [];
			var s;
			var dayOdd;
							
			salaryDate[0] = moment(currentDate).set('date', 5);
			salaryDate[1] = moment(currentDate).set('date', 20);
			salaryDayCorrector(salaryDate);
			
			if ((moment(currentDate).date() == moment(salaryDate[0]).date()) || (moment(currentDate).date() == moment(salaryDate[0]).date())){
				s = "Зарплата сегодня! " + smilyface;
			}
			if (moment(currentDate).date() < moment(salaryDate[0]).date()){
				s = String(moment(salaryDate[0]).format('DD.MM.YY') + " " + smileyface);							
			}
			if ((moment(currentDate).date() > moment(salaryDate[0]).date()) && (moment(currentDate.date()) < moment(salaryDate[1]).date())){
				dayOdd = moment(salaryDate[1]).date() - moment(currentDate.date());
				if (dayOdd => 5){
					s = String(moment(salaryDate[1]).format('DD.MM.YY') + " " + sadface);
				}
				else{
					s = String(moment(salaryDate[0]).format('DD.MM.YY') + " " + smileyface);
				}
			}
			
			if (moment(currentDate).date() > moment(salaryDate[1]).date()){
				salaryDate[0] = moment(salaryDate[0].set('month', (moment(salaryDate[0].get('month')+1))));
				salaryDate[0].setDate(5);
				salaryDate[0] = getSalaryDay(salaryDate[0]);
				dayOdd = (moment(currentDate).endOf('month') - moment(currentDate).date()) + moment(salaryDate[0]).date();
				if (dayOdd => 5){
					s = String(moment(salaryDate[1]).format('DD.MM.YY') + " " + sadface);
				}
				else{
					s = String(moment(salaryDate[0]).format('DD.MM.YY') + " " + smileyface);
				}
			}
			
		return s;
		}
		
	var action = response.result.action;	
	var actionStatus = response.result.actionIncomplete;
	var s = response.result.fulfillment.speech;
	
	if (action == "salary" && actionStatus == false){
		var datePeriod = response.result.parameters['date-period'];
		var salaryMonth = datePeriod.split('/')[0].split('-')[1];
		var salaryYear = datePeriod.split('/')[0].split('-')[0];
		
	if (datePeriod != ''){
		var salaryDates = [];
		salaryDates[0] = moment(new Date(parseInt(salaryYear) + "." + parseInt(salaryMonth))).set('date', 5);
		salaryDates[1] = moment(new Date(parseInt(salaryYear) + "." + parseInt(salaryMonth))).set('date', 20);
		salaryDayCorrector(salaryDates);
		
		s = "Первый день зарплаты - "
		+ moment(salaryDates[0]).format('dddd, DD.MM.YYYY') 
		+ ". Второй день зарплаты - " 
		+ moment(salaryDates[1]).format('dddd, DD.MM.YYYY') + "."
		bot.sendMessage(chatId, s);
		loging();
		}
		else{
			var currentDate = moment();
			s = checker(currentDate);
			console.log(s);
			bot.sendMessage(chatId, s);
			loging();
		}	
	}
	
	else{
	bot.sendMessage(chatId, s);
	loging();
	}
	});
	
	request.on('error', function(error) {
    console.log("Connection err");
	});
	request.end();
});