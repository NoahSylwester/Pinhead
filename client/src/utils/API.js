import axios from 'axios'

export default {
    queryProjects: () => axios.get("/projects"),
    queryProject: project => axios.get("/projects", { project }),
    createProject: () => axios.post("/projects"),
    deleteProject: () => axios.delete("/projects"),
    queryMarkers: project => axios.get("/markers", { project }),
    createMarker: project => axios.post("/markers", { project }),
    updateMarker: marker => axios.put("/markers", { marker }),
    deleteMarker: marker => axios.delete("/markers", { marker }),
}