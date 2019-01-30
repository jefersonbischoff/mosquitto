(function() {
	window.Main = {};
	Main.Page = (function() {
		var mosq = null;
		function Page() {
			var _this = this;
			mosq = new Mosquitto();

			$('#connectbutton').click(function() {
				
				var Topic = $('#pubtopictext')[0].value;	
				var p = document.createElement("p");
				p.innerHTML = Topic;
				$("#debug").append(p);
				
				
				return _this.connect();
			});
			$('#disconnectbutton').click(function() {
				return _this.disconnect();
			});
			$('#subscribebutton').click(function() {
				return _this.subscribe();
			});
			$('#unsubscribebutton').click(function() {
				return _this.unsubscribe();
			});
			
			
			$('#ligaoutput').click(function() {
				var payload = "L";  			
				var TopicPublish = $('#pubtopictext')[0].value;				
				mosq.publish(TopicPublish, payload, 0);
			});

			
			$('#desligaoutput').click(function() {
				var payload = "D";  			
				var TopicPublish = $('#pubtopictext')[0].value;				
				mosq.publish(TopicPublish, payload, 0);
			});

			mosq.onconnect = function(rc){
				var p = document.createElement("p");
				var topic = $('#pubsubscribetext')[0].value;
				p.innerHTML = "Conectado ao Broker!";
				$("#debug").append(p);
				mosq.subscribe(topic, 0);
				
			};
			mosq.ondisconnect = function(rc){
				var p = document.createElement("p");
				var url = "ws://iot.eclipse.org/ws";
				
				p.innerHTML = "A conexão com o broker foi perdida";
				$("#debug").append(p);				
				mosq.connect(url);
			};
			mosq.onmessage = function(topic, payload, qos){
				var p = document.createElement("p");
				var acao = payload[0];
				
				//escreve o estado do output conforme informação recebida
				if (acao == 'L')
				{
					p.innerHTML = "<center><img src='ligado.png'></center>"
					$("#status_io").html(p);
				}
				if (acao == 'D')
				{
					p.innerHTML = "<center><img src='desligado.png'></center>"
					$("#status_io").html(p);
				}
				//escreve o valor da entrada analogica conforme informação recebida
				if (acao == 'A')
				{
					p.innerHTML = payload.substring(1); //retirar o primeiro caracter da string = 'A'
					$("#analogval").html(p);
				}
			};
		}
		Page.prototype.connect = function(){
			var url = "ws://iot.eclipse.org/ws";
			mosq.connect(url);
		};
		Page.prototype.disconnect = function(){
			mosq.disconnect();
		};
		Page.prototype.subscribe = function(){
			var topic = $('#subtopictext')[0].value;
			mosq.subscribe(topic, 0);
		};
		Page.prototype.unsubscribe = function(){
			var topic = $('#subtopictext')[0].value;
			mosq.unsubscribe(topic);
		};
		
		return Page;
	})();
	$(function(){
		return Main.controller = new Main.Page;
	});
}).call(this);

