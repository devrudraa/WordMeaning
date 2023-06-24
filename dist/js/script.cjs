// Some variables to target the DOM elements
const WordDoc = document.querySelector("#word");
const PronounCiationDoc = document.querySelector("#pronounciation");
const Meanings = document.querySelector("#meanings");
const QuerryWord = document.querySelector("#WordInp");
const SearchButton = document.querySelector("#search");
const PlayButton = document.querySelector("#speak");
const loading = document.querySelector("#loading");

// Variable to store the audio file!
// Initially the audio of welcome word
let audio = new Audio(
  "https://api.dictionaryapi.dev/media/pronunciations/en/welcome-uk.mp3"
);

//* Listning if the button is clicked to fetch the data and show the answer
SearchButton.addEventListener("click", async function () {
  //! Note: We are using tailwind and hidden is a tailwind class to hide a element by setting display to none
  //* Adding or removing the loading screen
  loading.classList.toggle("hidden");

  //* The same way removing meaning container and error container from the screen
  document.querySelector("#MeaningConatiner").classList.add("hidden");
  document.querySelector("#error").classList.add("hidden");

  //! https://api.dictionaryapi.dev/ is the site from where we will get the data
  //* Creating a customized url to fetch data
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${QuerryWord.value}`;

  //* Waiting for the request to get completed
  await searchWord(url);
});

//* To play the sound (Which we will get from the fetched data)
PlayButton.addEventListener("click", function () {
  audio.play();
});

//* Fetching the data
async function searchWord(url) {
  try {
    //* Waiting for the responce
    const response = await fetch(url);
    if (response.status === 404) {
      //* If no word found or we ran into some error we will say the meaning not found error page
      document.querySelector("#error").classList.remove("hidden");
      document.querySelector("#loading").classList.add("hidden");
      document.querySelector("#error h2 span").innerHTML = QuerryWord.value;
      return;
    }

    //* Converting data into JSON format to use
    let data = await response.json();

    //* Setting the audio to undefined so if there is no audio file in the data
    //* we can easily identify it and remove the audio button
    audio = undefined;

    //* Here it will show the loding screen
    loading.classList.toggle("hidden");

    //* Meaning container and error container from the screen
    document.querySelector("#MeaningConatiner").classList.remove("hidden");
    document.querySelector("#error").classList.add("hidden");

    //* Trying to process the data if not the meaning didn't found
    //* Or could be that user gave a wrong word that doesn't exist in our dictionary!

    //! All these data processing is done on the basis of the json that we will get

    data = data[0];
    word = data.word;

    let { phonetics } = data; //* For extracting audio
    let { phonetic } = data; //* For pronounciation text

    let meaning = data.meanings;

    //* It will check all the data of phonetics and take the one which has audio in it
    phonetics.forEach((element) => {
      if (element.audio != "") {
        audio = new Audio(element.audio);
      }
    });

    //* Removing the play sound/audio button as no audio file was found in the data
    audio == undefined
      ? PlayButton.classList.add("hidden")
      : PlayButton.classList.remove("hidden");

    WordDoc.innerHTML = word;
    PronounCiationDoc.innerHTML = "";
    phonetic != undefined ? (PronounCiationDoc.innerHTML = phonetic) : "";

    //* Removing the previous response that we got
    Meanings.innerHTML = "";

    //* Appending the data or meaning of parts of speech one by one
    meaning.map((data) => {
      AppendMeaning(data);
    });
  } catch (error) {
    if (error.message === "Network response was not ok") {
      // HTTP error (e.g., 404 - Not Found)
      console.log("Not found error");
    } else {
      // Other error (e.g., network failure)
      //* If the user is not connected to the internet we will show a alert and then the error page
      alert("Please connect to the internet!");
      document.querySelector("#error").classList.remove("hidden");
      document.querySelector("#loading").classList.add("hidden");
      document.querySelector("#error h2 span").innerHTML = QuerryWord.value;
    }
  }
}

function AppendMeaning(data) {
  //* Adding all the data to the DOM conainter
  //* All the data are precheck if the data is avalable in the data(variable) then only we are showing that
  //* If not then nothing is shown

  Meanings.innerHTML += `
    <section class="chip-wrapper">
      <div class="chip">
        <label class="">${data?.partOfSpeech}</label>
      </div>

      <div class="ml-16">
        <p><b>Definition: </b> ${data?.definitions[0].definition} </p>
        
        ${
          data?.definitions[0]?.example != undefined
            ? `<p> <b>Example: </b> ${data?.definitions[0]?.example}</p>`
            : ""
        }
        ${
          data?.synonyms.length > 0
            ? `<p><b>Synonyms: </b>
            ${data.synonyms.join(", ")}</p>`
            : ""
        }
        ${
          data?.antonyms.length > 0
            ? `<p><b>Antonyms: </b>
            ${data.antonyms.join(", ")}</p>`
            : ""
        }

      </div>
    </section>`;
}
