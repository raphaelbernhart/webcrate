
class API {
	constructor(axios, publicMode) {
		this.axios = axios
		this.http = axios.create({
			baseURL: publicMode ? '/api/public' : '/api'
		})

		this.publicMode = publicMode
	}

	async getConfig() {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/config`)

		return res.data
	}

	async setConfig(config) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.put(`/config`, config)

		return res.data
	}

	async getCrates() {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/crate`)

		return res.data
	}

	async getExternalCrates() {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/crate/external`)

		return res.data
	}

	async getRecentCrates() {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/crate/recent`)

		return res.data
	}

	async getLinksOfCrate(crate, limit = 20, last) {
		const { data: res } = await this.http.get(`/link?crate=${ crate }&limit=${ limit }&last=${ last || '' }`)

		return res
	}

	async getLinksOfExternalCrate(crate, limit = 20, last) {
		const { data: res } = await this.axios.get(`https://${ crate.endpoint }/api/public/link?crate=${ crate.id }&limit=${ limit }&last=${ last || '' }`)

		return res
	}

	async getRecentLinks(num = 10) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/link?limit=${ num }`)

		return res.data
	}

	async getOrphanedLinks(limit = 20, last) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/link?crate=null&limit=${ limit }&last=${ last || '' }`)

		return res
	}

	async addLinkToCrate(url, crate) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.post(`/link`, {
			url,
			crate
		})

		return res.data
	}

	async deleteLink(id) {
		if (this.publicMode) return undefined

		await this.http.delete(`/link/${ id }`)
	}

	async getLink(id) {
		const { data: res } = await this.http.get(`/link/${ id }`)

		return res.data
	}

	async getExternalLink(id, endpoint) {
		const { data: res } = await this.axios.get(`https://${ endpoint }/api/public/link/${ id }`)

		return res.data
	}

	async changeLink(link, data) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.put(`/link/${ link }`, {
			...data
		})

		return res.data
	}

	async deleteCrate(id) {
		if (this.publicMode) return undefined

		await this.http.delete(`/crate/${ id }`)
	}

	async deleteExternalCrate(id) {
		if (this.publicMode) return undefined

		await this.http.delete(`/crate/external/${ id }`)
	}

	async moveLinkToCrate(id, crate) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.put(`/link/${ id }`, {
			crate
		})

		return res.data
	}

	async addCrate(name, icon) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.post(`/crate`, {
			name,
			icon
		})

		return res.data
	}

	async addExternalCrate(url) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.post(`/crate/external`, {
			url
		})

		return res.data
	}

	async getCrate(id) {
		const { data: res } = await this.http.get(`/crate/${ id }`)

		return res.data
	}

	async getExternalCrate(id) {
		const { data: res } = await this.http.get(`/crate/external/${ id }`)

		return res.data
	}

	async changeCrate(crate, data) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.put(`/crate/${ crate }`, {
			...data
		})

		return res.data
	}

	async search(query, last) {
		if (this.publicMode) return undefined

		const { data: res } = await this.http.get(`/search?query=${ query }&limit=10&last=${ last || '' }`)

		return res.data
	}
}

export default ({ app: { $axios }, store, params }, inject) => {
	const isPublic = params.pathMatch && params.pathMatch.includes('public')

	if (isPublic) {
		store.commit('SET_PUBLIC_MODE', true)
	}

	const api = new API($axios, isPublic)

	inject('api', api)
}