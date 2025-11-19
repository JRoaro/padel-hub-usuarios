import fetchAPI from './apiConstants';

class TorneosRepository {
    static async getTorneo(id) {
        return await fetchAPI(`/api/cliente/torneos/${id}`);
    }

    static async unirseTorneo(id, data) {
        return await fetchAPI(`/api/cliente/torneos/${id}/unirse`, {
            method: "POST",
            body: JSON.stringify(data)
        });
    }
}
export default TorneosRepository;