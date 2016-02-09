$(function() {
	$('.bg-quiz').height($('.text-white-bg-red').height()+parseFloat($('.text-white-bg-red').css('paddingTop'))+parseFloat($('.text-white-bg-red').css('paddingBottom')));
	$('.bg-fnac').height($('.bg-affiche').height()-parseFloat($('.bg-fnac').css('paddingTop')));
	
	$('.picto').each(function() {
		$(this).on('mouseover', function() {
			$(this).next().addClass('active');
		});
	});
	$('.picto-content').each(function() {
		$(this).on('mouseout', function() {
			$(this).removeClass('active');
		});
	});
	
	$('.question').eq(0).css('display', 'block').addClass('active');
//	$('.question').eq(7).css('display', 'block').addClass('active');
});

// Valide une réponse à une question du quiz
function chooseAnswer(el) {
	$('img', $(el)).attr('src', 'lib/img/answer_on.gif').addClass('checked');
	$(el).parents('li').addClass('choosen');
	$(el).parents('.question').find('li.good').addClass('font-red');
	$(el).parents('.question').find('.answer').css('display', 'block');
	$(el).parents('.question').find('a').removeAttr('onclick');
}

// Passe à la question suivante
function next() {
	var num = parseInt($('.current').html());
	
	// On vérifie si la réponse à la question courante a été donnée
	if($('.checked', $('.question').eq(num-1)).length > 0) {
		$('.question').eq(num-1).css('display', 'none');
		$('.question').eq(num).css('display', 'block');
		if(num+1 > 7) {
			// On affiche le bon message selon le nombre de réponses
			var count = $('.good.choosen').length;
			
			if(count <= 2) {
				$('.answer-2').removeClass('hide');
			}
			else if(count <= 6) {
				$('.answer-6').removeClass('hide');
			}
			else if(count <= 7) {
				$('.answer-7').removeClass('hide');
			}
			
			$('.q-number').html('');
			$('.q-btn').html('Valider').on('click', function() {
				$('#email, #firstname, #name').css('border', 'none');
				
				// Vérification des données et envoi des réponses	
				var email = $('#email').val();
				var firstname = $('#firstname').val();
				var name = $('#name').val();
				
				var errors = false;
				var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if(email == '' || !re.test(email)) {
					errors = true;
					$('#email').css('border', 'solid 1px #ff0249');
				}
				if(firstname == '') {
					errors = true;
					$('#firstname').css('border', 'solid 1px #ff0249');
				}
				if(name == '') {
					errors = true;
					$('#name').css('border', 'solid 1px #ff0249');
				}
				
				if(!errors) {
					$('.q-btn').addClass('hide');
					
					// Envoi du JSON des réponses
					var json = new Object();
					json.schema = "planfam_simoneforever";
					json.db = {
						"firstname": firstname,
						"lastname": name,
						"email": email,
						"origine": "",
						"optin": $('#optin').val(),
						"q1": $('.question').eq(0).find('.choosen').find('.answer-text').html(),
						"q2": $('.question').eq(1).find('.choosen').find('.answer-text').html(),
						"q3": $('.question').eq(2).find('.choosen').find('.answer-text').html(),
						"q4": $('.question').eq(3).find('.choosen').find('.answer-text').html(),
						"q5": $('.question').eq(4).find('.choosen').find('.answer-text').html(),
						"q6": $('.question').eq(5).find('.choosen').find('.answer-text').html(),
						"q7": $('.question').eq(6).find('.choosen').find('.answer-text').html()
					};
					
					$('.q-title').html('Merci pour votre participation !');
					
					$('.q-btn').html('Retour').on('click', function(){
						document.location.href = '/';
					}).removeClass('hide');
					
					$('.q-text').addClass('hide');
					
					$.ajax({
						type: "POST",
						url: "https://form-to-db.herokuapp.com/",
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						data: JSON.stringify(json)
					});
				}
			});
		}
		else {
			$('.current').html(num+1);
		}
	}
}

function toggleCheckbox(el) {
	if($('img', $(el)).attr('src') == 'lib/img/checkbox_on.gif') {
		$('img', $(el)).attr('src', 'lib/img/checkbox_off.gif');
		$('#optin').val(0);
	}
	else {
		$('img', $(el)).attr('src', 'lib/img/checkbox_on.gif');
		$('#optin').val(1);
	}
}