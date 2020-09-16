import axios from 'axios';

const getTokenAndId = () => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    return { token, userId }
}

export default {
    // auth API
    registerUser: (username, password, email) => axios.post("/auth/register", { email, username, password }),
    loginUser: (email, password) => axios.post("/auth/login", { email, password }),
    checkUser: () => {
        const { token, userId } = getTokenAndId();
        return axios.get(`/api/users/${userId}`, {
            headers: {'x-access-token': token}
        })
    },
    // data API
    queryProjects: () => {
        const { token } = getTokenAndId();
        return axios.get("/api/projects", {
            headers: {'x-access-token': token},
        });
    },
    queryProject: projectId => {
        const { token } = getTokenAndId();
        return axios.get(`/api/projects/${projectId}`, {
            headers: {'x-access-token': token},
        })
    },
    createProject: () => {
        const { token } = getTokenAndId();
        return axios.post("/api/projects", { token })
    },
    updateProject: project => {
        const { token } = getTokenAndId();
        return axios.put(`/api/projects/${project._id}`, { token, project })
    },
    updateProjectImage: function(id, updateData, config) {
        const token = localStorage.getItem('token');
        return axios.put(`/api/projects/image/${id}`, updateData, { ...config, method: "PUT", headers: {'x-access-token': token}});
        // return fetch(`/api/projects/image/${id}`, { ...config, body: updateData, method: "PUT", headers: {'x-access-token': token}});
      },
    deleteProject: projectId => {
        const { token } = getTokenAndId();
        return axios.delete(`/api/projects/${projectId}`, {
            headers: {'x-access-token': token},
        })
    },
    queryMarkers: projectId => {
        const { token } = getTokenAndId();
        return axios.get(`/api/markers/${projectId}`, {
            headers: {'x-access-token': token},
        })
    },
    createMarker: (projectId, x, y, data_keys = [], data_values = []) => {
        const { token } = getTokenAndId();
        return axios.post("/api/markers", { project: projectId, x, y, data_keys, data_values, token })
    },
    updateMarker: marker => {
        const { token } = getTokenAndId();
        return axios.put(`/api/markers/${marker._id}`, { marker, token })
    },
    deleteMarker: markerId => {
        const { token } = getTokenAndId();
        return axios.delete(`/api/markers/${markerId}`, {
            headers: {'x-access-token': token},
        })
    },
}