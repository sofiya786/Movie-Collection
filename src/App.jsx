import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [cinemaData, setCinemaData] = useState([]);
  const [newCinema, setNewCinema] = useState({ movie: "", description: "", image: "" });
  const [editCinemaData, setEditCinemaData] = useState(null); // New state for editing
  const [loading, setLoading] = useState(true);

  const API_URL = "https://cinema-phi-eight.vercel.app/api/cinema";

  // Fetch data from API
  useEffect(() => {
    fetchCinemaData();
  }, []);

  const fetchCinemaData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setCinemaData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for new cinema or editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editCinemaData) {
      setEditCinemaData({ ...editCinemaData, [name]: value });
    } else {
      setNewCinema({ ...newCinema, [name]: value });
    }
  };

  // Add new cinema
  const addCinema = async (e) => {
    e.preventDefault();
    if (!newCinema.movie || !newCinema.description || !newCinema.image) {
      alert("All fields are required!");
      return;
    }
    try {
      await axios.post(API_URL, newCinema);
      setNewCinema({ movie: "", description: "", image: "" });
      fetchCinemaData();
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  // Edit cinema
  const editCinema = async (e) => {
    e.preventDefault();
    if (!editCinemaData.movie || !editCinemaData.description || !editCinemaData.image) {
      alert("All fields are required!");
      return;
    }
    try {
      await axios.put(`${API_URL}/${editCinemaData._id}`, editCinemaData);
      setEditCinemaData(null); // Close the edit form
      fetchCinemaData();
    } catch (error) {
      console.error("Error editing data:", error);
    }
  };

  // Delete a cinema entry
  const deleteCinema = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCinemaData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          🎬 Cinema Collection
        </h1>

        {/* Add New Cinema Form */}
        <form
          onSubmit={editCinemaData ? editCinema : addCinema}
          className="card bg-white shadow-lg p-6 mb-8 max-w-3xl mx-auto animate-slide-in rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            {editCinemaData ? "Edit Cinema" : "Add New Cinema"}
          </h2>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-gray-600">Movie Name</span>
            </label>
            <input
              type="text"
              name="movie"
              value={editCinemaData ? editCinemaData.movie : newCinema.movie}
              onChange={handleInputChange}
              className="input input-bordered border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter movie name"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-gray-600">Description</span>
            </label>
            <input
              type="text"
              name="description"
              value={editCinemaData ? editCinemaData.description : newCinema.description}
              onChange={handleInputChange}
              className="input input-bordered border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter description"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-gray-600">Image URL</span>
            </label>
            <input
              type="text"
              name="image"
              value={editCinemaData ? editCinemaData.image : newCinema.image}
              onChange={handleInputChange}
              className="input input-bordered border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter image URL"
            />
          </div>
          <div className="card-actions justify-end">
            <button
              type="submit"
              className="btn bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
            >
              {editCinemaData ? "Update" : "Save"}
            </button>
          </div>
        </form>

        {/* Cinema List */}
        {loading ? (
          <div className="text-center">
            <button className="btn btn-ghost loading">Loading...</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cinemaData.map((cinema) => (
              <div
                key={cinema._id}
                className="card bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl p-4 hover:shadow-2xl transform transition-all duration-300 rounded-lg"
              >
                <figure className="mb-4">
                  <img
                    src={cinema.image}
                    alt={cinema.movie}
                    className="rounded-lg w-full object-cover h-48"
                  />
                </figure>
                <h2 className="text-2xl font-bold">{cinema.movie}</h2>
                <p className="text-sm mt-2">🎥 {cinema.description}</p>

                <div className="card-actions mt-4 justify-end">
                  {/* Edit Button */}
                  <button
                    className="btn bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
                    onClick={() => setEditCinemaData(cinema)} // Set cinema data to edit
                  >
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    className="btn bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-500 hover:to-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
                    onClick={() => deleteCinema(cinema._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
