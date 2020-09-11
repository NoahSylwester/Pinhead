import axios from 'axios';

export default {
    // auth API
    registerUser: (username, password, email) => axios.post("/auth/register", { email, username, password }),
    loginUser: (email, password) => axios.post("/auth/login", { email, password }),

    // data API
    queryProjects: () => {
        const token = localStorage.getItem("token")
        return axios.get("/api/projects", {
            headers: {'x-access-token': token},
        });
    },
    queryProject: projectId => {
        const token = localStorage.getItem("token")
        return axios.get(`/api/projects/${projectId}`, {
            headers: {'x-access-token': token},
        })
    },
    createProject: () => {
        const token = localStorage.getItem("token")
        return axios.post("/api/projects", { token })
    },
    deleteProject: projectId => {
        const token = localStorage.getItem("token")
        return axios.delete(`/api/projects/${projectId}`, {
            headers: {'x-access-token': token},
        })
    },
    queryMarkers: projectId => {
        const token = localStorage.getItem("token")
        return axios.get(`/api/markers/${projectId}`, {
            headers: {'x-access-token': token},
        })
    },
    createMarker: project => {
        const token = localStorage.getItem("token")
        return axios.post("/api/markers", { project, token })
    },
    updateMarker: marker => {
        const token = localStorage.getItem("token")
        return axios.put("/api/markers", { marker, token })
    },
    deleteMarker: markerId => {
        const token = localStorage.getItem("token")
        return axios.delete("/api/markers", { markerId, token })
    },
}