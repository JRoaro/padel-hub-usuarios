import fetchAPI from './apiConstants';

class ClubsRepository {
    static async getClubs() {
        return await fetchAPI('/api/cliente/clubs');
    }
}

export default ClubsRepository;