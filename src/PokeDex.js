import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";
import BarChart from "react-easy-bar-chart";
// import { PDFViewer } from '@react-pdf/renderer';
// import FeeAcceptance from '../Pdfgenerator/FeeAcceptance'


function PokeDex() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ order: 'asc', orderBy: 'id' })
  const [api, setApi] = useState ("https://pokeapi.co/api/v2/pokemon");

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "black",
      color: "white",
    },
    overlay: { backgroundColor: "grey" },
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPokeDex();

  }, [api]);


  function fetchPokeDex() {
    axios
      .get(api)
      .then((res) => {
        const { results} = res.data;
        setPokemons(results);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  function dataToBarChart(data) {
    return data.map((e) => ({
      title: e.stat.name,
      value: e.base_stat,
      color: "blue",
    }));
  }
  
  useEffect(() => {
    let result = pokemons;
    console.log({ search });
    if (!!search) {
      axios
        .get("https://pokeapi.co/api/v2/pokemon")
        .then((res) => {
          const { results } = res.data;
            result = results.filter((pokemon) => {
              return pokemon.name.includes(search);
            });
          }
        );
    } else if (!search) {
      console.log("go here");
      setIsLoading(true);
      fetchPokeDex();
    }
  }, [search]);

  const handleEmptyField = (event) => {
    if (!event.target.value) setSearch("");
  };


  if (!isLoading && pokemons.length === 0) {
    return (
      <div>
        <header className="App-header">
          <h1>Welcome to pokedex !</h1>
          <h2>Requirement:</h2>
          <ul>
            <li>
              Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex, and show a list of pokemon name.
            </li>
            <li>Implement React Loading and show it during API call</li>
            <li>when hover on the list item , change the item color to yellow.</li>
            <li>when clicked the list item, show the modal below</li>
            <li>
              Add a search bar on top of the bar for searching, search will run
              on keyup event
            </li>
            <li>Implement sorting and pagination</li>
            <li>Commit your codes after done</li>
            <li>If you do more than expected (E.g redesign the page / create a chat feature at the bottom right). it would be good.</li>
          </ul>
        </header>
      </div>
    );
  }

  return (
    <div>
      <header className="App-header">
        {isLoading ? (
          <>
            <div className="App">
              <header className="App-header">
                <ReactLoading 
                  type={"spin"}
                  color="#fff"
                />
              </header>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to pokedex !</h1>
            <input 
              type="search"
              name="search" 
              defaultValues=""
              onKeyUp ={(e) => setPokemons(e.target.value)}
              onChange={handleEmptyField}
            />
            <button onClick={() => sort()}>Sort</button>
          </>
        )}
      </header>
      {pokemonDetail && (
        <Modal
          isOpen={pokemonDetail}
          contentLabel={pokemonDetail?.name || ""}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}
          style={customStyles}
        >
          {/* <div>
            Requirement:
            <ul>
              <li>show the sprites front_default as the pokemon image</li>
              <li>
                Show the stats details - only stat.name and base_stat is
                required in tabular format
              </li>
              <li>Create a bar chart based on the stats above</li>
              <li>Create a  buttton to download the information generated in this modal as pdf. (images and chart must be included)</li>
            </ul>
          </div> */}

          <div>
            <img
              src={pokemonDetail.sprites.front_default}
              alt="sprites front_default"
            ></img>
            <br/>
            <span> Stat Details</span>
            <ul>
              {pokemonDetail && pokemonDetail.stats && pokemonDetail.stats.map((e, idx) => (
                <li key={idx}> 
                Stat Name : {e.stat.name}
                <br></br>
                Base Name : {e.base_stat}
                </li>
              ))}
            </ul>
            <BarChart
              xAxis="stats"
              yAxis="values"
              data={dataToBarChart(pokemonDetail.stats)}
            />
          </div>
          <button 
            // onClick={() => printDocument()} 
            style={{ cursor: "pointer" }}>
            Download as PDF
          </button>
        </Modal>
      )}
    </div>
  );
}

export default PokeDex;
