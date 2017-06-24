$(document).ready(function() {
  console.log("Everything loaded!")

  // Each form
  var form1 = $('#form1');
  var form2 = $('#form2');
  var form3 = $('#form3');
  var form4 = $('#form4');

  // Each form's button (to go to the next form)
  var form1button = $('#next-button1');
  var form2button = $('#next-button2');
  var form3button = $('#next-button3');
  var form4button = $('#next-button4');

  // back buttons
  var backto1 = $('#back-button1');
  var backto2 = $('#back-button2');
  var backto3 = $('#back-button3');

  // Top 'step' buttons
  var step1TopButton = $('ul.stepPreviewPanal li:nth-child(1)')
  var step2TopButton = $('ul.stepPreviewPanal li:nth-child(2)')
  var step3TopButton = $('ul.stepPreviewPanal li:nth-child(3)')
  var step4TopButton = $('ul.stepPreviewPanal li:nth-child(4)')

  // Step button navigation 
  var step1nav = $('ul.stepPreviewPanal li:nth-child(1) a')
  var step2nav = $('ul.stepPreviewPanal li:nth-child(2) a')
  var step3nav = $('ul.stepPreviewPanal li:nth-child(3) a')
  var step4nav = $('ul.stepPreviewPanal li:nth-child(4) a')

  // Using step button to navigate 
  step1nav.on('click', function() {
    
    form2.removeClass('active');
    form2.addClass('hidden')
    form3.removeClass('active');
    form3.addClass('hidden');
    form4.removeClass('active');
    form4.addClass('hidden');
    form1.removeClass('hidden');
    form1.addClass('active');

    step2TopButton.removeClass('active');
    step2TopButton.addClass('disabled');
    step3TopButton.removeClass('active');
    step3TopButton.addClass('disabled');
    step4TopButton.removeClass('active');
    step4TopButton.addClass('disabled');
    step1TopButton.removeClass('disabled');
    step1TopButton.addClass('active');

  });

  step2nav.on('click', function() {

    form1.removeClass('active');
    form1.addClass('hidden')
    form3.removeClass('active');
    form3.addClass('hidden');
    form4.removeClass('active');
    form4.addClass('hidden');
    form2.removeClass('hidden');
    form2.addClass('active');

    step1TopButton.removeClass('active');
    step1TopButton.addClass('disabled');
    step3TopButton.removeClass('active');
    step3TopButton.addClass('disabled');
    step4TopButton.removeClass('active');
    step4TopButton.addClass('disabled');
    step2TopButton.removeClass('disabled');
    step2TopButton.addClass('active');

  });

  step3nav.on('click', function(){

    form1.removeClass('active');
    form1.addClass('hidden')
    form2.removeClass('active');
    form2.addClass('hidden');
    form4.removeClass('active');
    form4.addClass('hidden');
    form3.removeClass('hidden');
    form3.addClass('active');

    step1TopButton.removeClass('active');
    step1TopButton.addClass('disabled');
    step2TopButton.removeClass('active');
    step2TopButton.addClass('disabled');
    step4TopButton.removeClass('active');
    step4TopButton.addClass('disabled');
    step3TopButton.removeClass('disabled');
    step3TopButton.addClass('active');

  });
  
  step4nav.on('click', function(){

    form1.removeClass('active');
    form1.addClass('hidden')
    form2.removeClass('active');
    form2.addClass('hidden');
    form3.removeClass('active');
    form3.addClass('hidden');
    form4.removeClass('hidden');
    form4.addClass('active');

    step1TopButton.removeClass('active');
    step1TopButton.addClass('disabled');
    step2TopButton.removeClass('active');
    step2TopButton.addClass('disabled');
    step3TopButton.removeClass('active');
    step3TopButton.addClass('disabled');
    step4TopButton.removeClass('disabled');
    step4TopButton.addClass('active');

  });

  // To do back button, reverse all the hiddens and disabled 
  // Proceed to Step2
  form1button.on('click', function() {
    form2.removeClass('hidden');
    form1.addClass('hidden');

    step1TopButton.removeClass('active');
    step1TopButton.addClass('disabled');
    step2TopButton.removeClass('disabled');
    step2TopButton.addClass('active');

  });

  // Go back to Step 1
  backto1.on('click', function() {
    console.log("I have pressed the back button")
    form2.addClass('hidden');
    form1.removeClass('hidden');

    step2TopButton.removeClass('active');
    step2TopButton.addClass('disabled');
    step1TopButton.removeClass('disabled')
    step1TopButton.addClass('active');
  });

  // Proceed to Step3
  form2button.on('click', function() {
    form3.removeClass('hidden');
    form2.addClass('hidden');

    step2TopButton.removeClass('active');
    step2TopButton.addClass('disabled');
    step3TopButton.removeClass('disabled');
    step3TopButton.addClass('active');
  });

  // Back to Step 2
  backto2.on('click', function(){
    form3.addClass('hidden');
    form2.removeClass('hidden');

    step3TopButton.removeClass('active');
    step3TopButton.addClass('disabled');
    step2TopButton.removeClass('disabled');
    step2TopButton.addClass('active');
  })

  // Proceed to Step4
  form3button.on('click', function() {
    form4.removeClass('hidden');
    form3.addClass('hidden');

    step3TopButton.removeClass('active');
    step3TopButton.addClass('disabled');
    step4TopButton.removeClass('disabled');
    step4TopButton.addClass('active');
  });

  // Back to Step 3
  backto3.on('click', function(){
    form4.addClass('hidden');
    form3.removeClass('hidden');

    step4TopButton.removeClass('active');
    step4TopButton.addClass('disabled');
    step3TopButton.removeClass('disabled');
    step3TopButton.addClass('active');
  });

});



