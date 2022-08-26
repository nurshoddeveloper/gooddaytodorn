import store from 'react-native-simple-store';


const debug = {
    dev: false,
    head: "{LocalSettings}"
};


class LocalSettings {

    constructor(key,defaultValues) {
        if (debug.dev) console.log(debug.head,"constuctor",key,defaultValues);
        this.storageKey = key;
        this.default = defaultValues;
    }


    set(name,value) {
        if (debug.dev) console.log("@Local settings SET ",name,"=",value);

        if (this.default[name]!==undefined) {
            const varName = this.storageKey+"."+name;

            value = this.serialize(value);

            /*try {
                localStorage.setItem(varName, value);
            } catch (err) {
                window.gdEpicFail("local-settings-not-available",err);
            }*/
            return store.save(varName, value);

        } else {
            if (debug.dev) console.error("LOCALSETTINGS class error - param ",name," not fount in default vars");
            return Promise.reject();
        }

    }

    setArr(name,value) {
        value = value.join();
        this.set(name,value);
    }

    get(name) {
        const varName = this.storageKey+"."+name;
        /*
        let value;

        try {
            value = localStorage.getItem(varName);
        } catch(err) {
            value = null;
            gdEpicFail('local-settings-not-available',err);
        }

        if (value==null) {
            //allow null as value ...
            if (this.default[name]!=null) {
                this.set(name,this.default[name]);
                return this.default[name];
            }
            else {
                return null;
            }

        } else {
            return value;
        }
        */


      return store.get(varName)
        .then(value => {
          if (value==null) {
            //allow null as value ...
            if (this.default[name]!=null) {
              this.set(name, this.default[name]);
              return this.default[name];
            }
            else {
              return null;
            }

          } else {
            return value;
          }
        });
    }

    getArr(name) {

        const val = this.get(name);

        if (val && typeof val == 'string') {
            return val.split(",");
        } else if (val && Array.isArray(val)) {
            return val;
        } else {
            return [];
        }
    }

    serialize(value) {

        // if (typeof value == ...)

        return value;
    }

    resetToDefault(name) {
        if (this.default[name]!=undefined) {
            const varName = this.storageKey+"."+name;
            //localStorage.setItem(varName, this.default[name]);
            store.save(varName, this.default[name]);
        } else {
            if (debug.dev) console.error("LOCALSETTINGS class error - param ",name," not fount in default vars");
        }

    };

}

module.exports = LocalSettings;