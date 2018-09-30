var firsttime = window.localStorage.getItem('firsttime');
if(!firsttime) {
  window.localStorage.setItem('firsttime', '1');
  setTimeout( "$('header').addClass('loading');",1);
  setTimeout( "$('header').addClass('loaded');",2000);
}
function appr1() {
    var text = $('#appr1').val();
    var dict = jQuery.unique( (text + ' ').split('') );
    dict.sort();
    var counts = [];
    var distrib = [];
    for (var i = 0; i < dict.length; i++) {
        counts[i] = parseInt(0);
        distrib[i] = parseInt(0);
    }  
    for (var i = 0; i < text.length; i++) {
        var letter = text.charAt(i);
        counts[dict.indexOf(letter)] += parseInt(1);
    }
    for (var i = 0; i < dict.length; i++) {
        var currProb = counts[i] / text.length;
        var prevProb = (i == 0 ? 0 : distrib[i-1]);
        distrib[i] =
            (i != distrib.length - 1)
            ? currProb + prevProb
            : 1;
    }
    var resultSet = '';
    for (var i = 0; i < text.length; i++) {
        var rand = Math.random();
        console.log(rand);
        for (var j = 0; j < distrib.length; j++) {
            console.log(rand < distrib[j])
            if (rand < distrib[j]) {
                console.log(dict[j]);
                resultSet += dict[j];
                break;
            }
        }
    }
    $('#apprresult').text(resultSet);
}
function appr2() {
    var text = $('#appr1').val();
    var dict = jQuery.unique( (text + ' ').split('') );
    dict.sort();
    var counts = [];
    var distrib = [];
    for (var i = 0; i < dict.length; i++) {
        counts[i]  = [];
        distrib[i] = [];
        for (var j = 0; j < dict.length; j++) {
            counts[i][j] = parseInt(0);
            distrib[i][j] = parseInt(0);
        }
    }
    for (var i = 0; i < text.length; i++) {
        var prev = i == 0 ? ' ' : text.charAt(i - 1);
        var curr = text.charAt(i);
        var prevIndex = dict.indexOf(prev);
        var currIndex = dict.indexOf(curr);
         counts[prevIndex][currIndex]++;
    }
    for (var i = 0; i < dict.length; i++) {
        var count = counts[i].reduce(function(a, b) { return a + b; }, 0);
        for (var j = 0; j < dict.length; j++) {
            var prevProb = (j == 0) ? 0 : distrib[i][j-1];
            var currProb = counts[i][j] / count;
            distrib[i][j] =
                (j == (dict.length - 1))
                ? 1.0
                : prevProb + currProb;
         }
    }
    var resultSet = '';
    for (var k = 0; k < text.length; k++) {
        var prev = k == 0 ? ' ' : resultSet.charAt(k-1);
        var prevIndex = dict.indexOf(prev);
        var rand = Math.random();
        for (var i = 0; i < dict.length; i++) {
            if (rand < distrib[prevIndex][i]) {
                resultSet += dict[i];
                break;
            }
        }
    }
    $('#apprresult').text(resultSet);
}
function appr3() {
    var text = $('#appr1').val();
    var dict = jQuery.unique( (text + ' ').split('') );
    dict.sort();
    // govnocode detected =_=
    var counts = [];
    var distrib = [];
    for (var i = 0; i < dict.length; i++) {
        counts[i]  = [];
        distrib[i] = [];
        for (var j = 0; j < dict.length; j++) {
            counts[i][j] = [];
            distrib[i][j] = [];
            for (var k = 0; k < dict.length; k++) {
                counts[i][j][k] = parseInt(0);
                distrib[i][j][k] = parseInt(0);
            }
        }
    }
    for (var i = 0; i < text.length; i++) {
        var prePrev = (i == 0 || i == 1) ? ' ' : text.charAt(i - 2);
        var prev = i == 0 ? ' ' : text.charAt(i - 1);
        var curr = text.charAt(i);
        var prePrevIndex = dict.indexOf(prePrev);
        var prevIndex = dict.indexOf(prev);
        var currIndex = dict.indexOf(curr);
        counts[prePrevIndex][prevIndex][currIndex]++;
    }
    for (var i = 0; i < dict.length; i++) {
        for (var j = 0; j < dict.length; j++) {
            var count = counts[i][j].reduce(function(a, b) { return a + b; }, 0);
            for (var k = 0; k < dict.length; k++) {
                var prevProb = (k == 0) ? 0 : distrib[i][j][k - 1];
                var currProb = counts[i][j][k] / count;
                distrib[i][j][k] =
                    (k == (dict.length - 1))
                    ? 1.0
                    : prevProb + currProb;
            }
        }
    }
    var resultSet = '';
    for (var k = 0; k < text.length; k++) {
        var prePrev = (k == 0 || k == 1) ? ' ' : resultSet.charAt(k - 2);
        var prev = (k == 0) ? ' ' : resultSet.charAt(k - 1);
        var prePrevIndex = dict.indexOf(prePrev);
        var prevIndex = dict.indexOf(prev);
        var rand = Math.random();
        for (var i = 0; i < dict.length; i++) {
            if (rand < distrib[prePrevIndex][prevIndex][i]) {
                resultSet += dict[i];
                break;
            }
        }
    }
    $('#apprresult').text(resultSet);
}
function encr() {
    var source = $('#z3source').val();
    
    var p = parseInt(Math.random() * 1000 + 100);
    var g = parseInt(Math.random() * 1000 + 100);
    
    var Monika = new Client(p, g);
    var ThatBoldGuy = new Client(p, g);
    
    Monika.setEncryptor(ThatBoldGuy.modulus);
    ThatBoldGuy.setEncryptor(Monika.modulus);
    
    var encrypted = Monika.encryptMessage(source);
    $('#z3key').val(encrypted);
    var decrypted = ThatBoldGuy.decryptMessage(encrypted);
    $('#z3result').val(decrypted);    
}
function Client(p, g) {
    this.p = p;
    this.g = g;
    this.innerKey = parseInt(Math.random() * 5 + 1);
    this.modulus = Math.pow(g, this.innerKey) % p;
    this.setEncryptor = function(modulus){
        this.encryptor = Math.pow(modulus, this.innerKey) % this.p;
    };
    this.encryptMessage = function(message){
        var encrypted = [];
        var chars = message.split('');
        for (var j = 0; j < chars.length; j++) {
            encrypted[j] = chars[j].charCodeAt(0) * this.encryptor;
        }
        return encrypted;
    }
    
    this.decryptMessage = function(encrypted){
        var decrypted = [];
        var result = '';
        for (var j = 0; j < encrypted.length; j++) {
            decrypted[j] = encrypted[j] / this.encryptor;
            result += String.fromCharCode(decrypted[j]);
        }
        return result;
    }
}
function info() {
  var probabilities = $('#source').val().split(' ');
  
  var numeric_probs = [];
  for (var i = 0; i < probabilities.length; i++) {
    numeric_probs[i] = parseFloat(probabilities[i]);
  }
  
  var min = Math.min.apply(Math, numeric_probs);
  
  var Hmax = -1 * Math.log2(min);
  
  var Havg = 0;
  for (var i = 0; i < numeric_probs.length; i++) {
    Havg += numeric_probs[i] * Math.log2(numeric_probs[i]);
  }
  Havg *= -1;
  
  var redundancy = (Hmax - Havg) / Hmax;
  
  $('#max').val(Hmax);
  $('#avg').val(Havg);
  $('#redundancy').val(redundancy);
}

// a key map of allowed keys
var allowedKeys = {
  89: 'y',
  79: 'o',
  66: 'b',
  65: 'a'
};

// the 'official' Konami Code sequence
var konamiCode = ['y', 'o', 'b', 'a'];

// a variable to remember the 'position' the user has reached so far.
var konamiCodePosition = 0;

// add keydown event listener
document.addEventListener('keydown', function(e) {
  // get the value of the key code from the key map
  var key = allowedKeys[e.keyCode];
  // get the value of the required key from the konami code
  var requiredKey = konamiCode[konamiCodePosition];

  // compare the key with the required key
  if (key == requiredKey) {

    // move to the next key in the konami code sequence
    konamiCodePosition++;

    // if the last key is reached, activate cheats
    if (konamiCodePosition == konamiCode.length) {
      activateCheats();
      konamiCodePosition = 0;
    }
  } else {
    konamiCodePosition = 0;
  }
});

function activateCheats() {

  var audio = new Audio('https://s3-eu-west-1.amazonaws.com/wdildnproject2/toasty.mp3');
  audio.play();
  
  $('.toasty').addClass('animateIn');
  setTimeout(function(){ $('.toasty').removeClass('animateIn');
}, 3500);
}