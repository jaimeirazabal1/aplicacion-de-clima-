const fs = require('fs');

const axios = require('axios');


class Busquedas{

    historial = [];
    dbPath = './db/database.json';

    constructor(){
        // TODO leer DB si existe
        this.leerDB();
    }

    get paramsMapbox(){
        return {
            access_token:process.env.MAPBOX_KEY,
            limit:5,
            language:'es'
        }
    }

    get paramsWeather(){
        return {
            appid:process.env.OPENWEATHER_LEY,
       
            units:'metric',
            lang:'es',
        }
    }

    async ciudad( lugar = '' ){
        // peticion http
        // https://www.mapbox.com/

        // https://docs.mapbox.com/api/search/geocoding/

        const instance = axios.create({
            baseURL : `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
            params: this.paramsMapbox
        })

        const resp = await instance.get();

        return resp.data.features.map( lugar => ({
            id:lugar.id,
            nombre:lugar.place_name,
            lng:lugar.center[0],
            lat:lugar.center[1],
        }) );

        return [];// retornar los lugares
    }

    async climaLugar( lat, lon ){
        try {
            // instance axios
            const instance = axios.create({
                baseURL : `http://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon }
            })
            // resp.data 
            const resp = await instance.get();

            console.log('resp',resp.data)

            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    historialCapitalizado(){
        return this.historial.map( lugar => this.capitalizeFirstLetter(lugar) );
    }

    agregarHistorial(lugar = ''){
        // TODO prevenir duplicados
        if(!this.historial.includes(lugar.toLocaleLowerCase())){
            this.historial = this.historial.splice(0,5);
            this.historial.unshift(lugar.toLocaleLowerCase());
        }else{
            return
        }

        //grabar en DB
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial : this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    async leerDB(){
        // debe de existir
        if(fs.existsSync(this.dbPath)) {
            try {
                let data = await fs.readFileSync(this.dbPath, {encoding:'utf-8'});
                data = JSON.parse(data);
                this.historial = data.historial;
            } catch (error) {
                console.log(error);
            }
        }
    }

}


module.exports = Busquedas;