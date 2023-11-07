import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import axios from "axios";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import RoomIcon from "@mui/icons-material/Room";
import Register from "./components/Register";
import Login from "./components/Login";
const apiKey = import.meta.env.VITE_MAPBOX_TOKEN;

function App() {
  const myStorage = window.localStorage;
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState();
  const [viewState, setViewState] = useState({
    width: 400,
    height: 400,
    longitude: 80.50055556,
    latitude: 16.49388889,
    zoom: 3.5,
  });
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BASE_URL + "calls/pins"
        );
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({ ...viewState, latitude: lat, longitude: long });
  };
  const handleAddClick = (e) => {
    console.log(e);
    const latitude = e.lngLat.lat;
    const longitude = e.lngLat.lng;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post(
        import.meta.env.VITE_BASE_URL + "calls/pins",
        newPin
      );
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogOut = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };
  return (
    <div>
      <Map
        {...viewState}
        mapboxAccessToken={apiKey}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/shaashmit/clm6gla7k00yi01r4ht6u3yp1"
        onDblClick={handleAddClick}
      >
        {pins.map((p) => (
          <>
            <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
              <RoomIcon
                cursor="pointer"
                style={{
                  color: p.username === currentUser ? "tomato" : "slateblue",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="bottom"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(
                      <StarOutlineIcon className="astar" />
                    )}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="bottom"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter a title"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <label>Review</label>
                <input
                  type="text"
                  placeholder="Say us something"
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                />
                <label>Rating</label>
                <select
                  onChange={(e) => {
                    setRating(e.target.value);
                  }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button className="button logout" onClick={handleLogOut}>
            Log Out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log In
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </Map>
    </div>
  );
}

export default App;
