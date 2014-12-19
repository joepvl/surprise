(function() {
var $ = function(selector) {
  return document.querySelector(selector);
}

var slides = [
  "Here's the story",
  "Every year",
  "When Sint and Piet are sitting on the pakjesboat",
  "On their way back to Spain",
  "They get in a fight",
  "In the end it's always about a woman",
  "They don't really know her at all,",
  "Never even spoken to her,",
  "But they still fight",
  "It's all very sad and kind of embarrasing",
  "But yeah. It happened again this year",
  "And this year, it was about <h1>Femke</h1>",
  "It was pretty brutal",
  "Lots of blood was spilled",
  "But in the end, there was no clear winner",
  "So there was only one way left to settle...",
  "...AN EPIC RAP BATTLE",
  "The following is my account of that event",
  "It's also my poem. So please recite it as it comes up on the screen!",
  "Enjoy",
  { poet: "sint" },
  " &nbsp;&nbsp;&nbsp;...many rap<br>&nbsp;&nbsp;so &nbsp;flow <br>wow",
  "That was magnificent!",
  "And now, the answer!",
  { poet: "piet" },
  "OH SNAP!",
  "Who won? Let's hear it for... <h1>SINT!</h1>",
  "Alright, that was pretty loud...",
  "Now let's hear it for... <h1>PIET!</h1>",
  "Not bad, not bad. <em>Now</em> let's hear it for... <h1>FEMKE!</h1>",
  "Woah! Alright, I think it's pretty clear who's the winner here.",
  "Until next year, friends!",
  "Groeten, Sint & Piet",
  "~ FIN ~"
];

// acquire poems from page
var poems = {
  sint: document.getElementById('poem-sint').innerHTML,
  piet: document.getElementById('poem-piet').innerHTML
}

$('.prev-btn').addEventListener('click', function(event) {
  event.preventDefault();
  prevSlide();
});
$('.next-btn').addEventListener('click', function(event) {
  event.preventDefault();
  nextSlide();
});
document.addEventListener('keyup', function(e) {
  // console.log(e.keyCode);
  if (e.keyCode == 32 || e.keyCode == 39) { // space or right
    e.preventDefault();
    if (e.shiftKey == true) {
      prevSlide();
    } else {
      nextSlide();
    }
  }
  if (e.keyCode == 37) { // left
    prevSlide();
  }
  if (e.keyCode == 83) { // S
    toggleScrolling();
  }
  if (e.keyCode == 72) { // H
    toggleHighlights();
  }
});

var currentIndex = 0,
    slideEl = $('.slide-text'),
    scrollIntervalRef,
    scrolling = false;;

function toggleHighlights() {
  document.body.classList.toggle('no-highlights');
}
function startScrolling() {
  scrollIntervalRef = setInterval(function() {
    scrollBy(0, 1);
  }, 80);
  scrolling = true;
}
function stopScrolling() {
  clearInterval(scrollIntervalRef);
  scrolling = false;
}
function toggleScrolling() {
  if (scrolling) {
    stopScrolling();
  } else {
    startScrolling();
  }
}

function transformLayout(type) {
  switch (type) {
    case 'sint':
      document.body.classList.remove('piet');
      document.body.classList.add('sint');
      break;
    case 'piet':
      document.body.classList.remove('sint');
      document.body.classList.add('piet');
      break;
    case 'neutral':
    default:
      document.body.classList.remove('sint', 'piet');
      break;
  }
}

function moveToSlide(index) {
  stopPlayback();
  if (index < 0) {
    index = 0;
  }
  if (index > slides.length - 1) {
    index = slides.length - 1;
  }
  currentIndex = index;
  var slide = slides[index];
  if (typeof slide === "object") {
    slideEl.innerHTML = poems[slide.poet].replace(/\n/g, '<br>');
    transformLayout(slide.poet);
    startPlayback(slideEl.innerHTML);
  } else {
    transformLayout('neutral');
    slideEl.innerHTML = slides[index];
  }
}

function nextSlide() {
  moveToSlide(currentIndex + 1);
}
function prevSlide() {
  moveToSlide(currentIndex - 1);
}

var wordCounter = 0,
    wordCollection = [],
    wordTimeoutRef;
function spanifyWords(text) {
  var wrappedWords = text
                    .replace(/(^|\n| )(\S)/g, '$1<span>$2')
                    .replace(/(\S)($|\n| )/g, '$1</span>$2')
                    .replace(/\n/g, '<br>');
  return wrappedWords;
}
function setupWords(text) {
  var words = text.split(/\s+/);
  var wordCollection = words.map(function(word, i) {
    return [word, word.length];
  });
  // console.log(wordCollection);
  return wordCollection;
};
function nextWord() {
  wordTimeoutRef = setTimeout(function() {
    highlightWordAt(wordCounter);
    nextWord();
  }, wordCollection[wordCounter][1] * 100);
  wordCounter++;
}
function resetWords() {
  wordCounter = 0;
  wordCollection = [];
  clearTimeout(wordTimeoutRef);
}
function highlightWordAt(index) {
  $('.slide-text span:not(.highlighted)').classList.add('highlighted');
}

function startPlayback(text) {
  startScrolling();
  wordCollection = setupWords(text);
  slideEl.innerHTML = spanifyWords(text);
  nextWord();
}
function stopPlayback() {
  stopScrolling();
  scroll(0, 0);
  resetWords();
}

// init
moveToSlide(0);
}());
