const WordDoc = document.querySelector("#word");
const PronounCiationDoc = document.querySelector("#pronounciation");
const Meanings = document.querySelector("#meanings");
const QuerryWord = document.querySelector("#WordInp");
const SearchButton = document.querySelector("#search");
const PlayButton = document.querySelector("#speak");
const loading = document.querySelector("#loading");

let audio;

SearchButton.addEventListener("click", async function () {
  loading.classList.toggle("hidden");
  document.querySelector("#MeaningConatiner").classList.add("hidden");
  document.querySelector("#error").classList.add("hidden");

  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${QuerryWord.value}`;
  await searchWord(url);
});

PlayButton.addEventListener("click", function () {
  audio.play();
});

async function searchWord(url) {
  try {
    const response = await fetch(url);

    let data = await response.json();
    audio = undefined;
    loading.classList.toggle("hidden");
    document.querySelector("#MeaningConatiner").classList.remove("hidden");
    document.querySelector("#error").classList.add("hidden");

    data = data[0];
    word = data.word;
    let { phonetics } = data; //* For extracting audio
    let { phonetic } = data; //* For pronounciation

    let meaning = data.meanings;

    //* It will check all the data of phonetics and take the one which has audio in it
    phonetics.forEach((element) => {
      if (element.audio != "") {
        audio = new Audio(element.audio);
      }
    });

    audio == undefined
      ? PlayButton.classList.add("hidden")
      : PlayButton.classList.remove("hidden");

    WordDoc.innerHTML = word;
    PronounCiationDoc.innerHTML = "";
    phonetic != undefined ? (PronounCiationDoc.innerHTML = phonetic) : "";
    Meanings.innerHTML = "";

    meaning.map((data) => {
      AppendMeaning(data);
    });
  } catch (error) {
    console.error(error);
    document.querySelector("#MeaningConatiner").classList.add("hidden");
    document.querySelector("#error").classList.remove("hidden");
    document.querySelector("#error h2 span").innerHTML = QuerryWord.value;
  }
}

function AppendMeaning(data) {
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
