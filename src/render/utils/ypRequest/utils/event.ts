import { YpEvent, YpEventCb, YpEventStore } from '../types';

 function myEvents(): YpEvent {
    let events: YpEventStore = {}

    return {
        on(name: string, callback: YpEventCb) {
            if (!events[name]) {
                events[name] = []
            }
            events[name].push(callback)
        },
        emit(name: string, data: any) {
            if (events[name]) {
                events[name].forEach(callback => callback && callback(data));
            }
        },
        off(name: string, callback: YpEventCb) {
            if (events[name]) {
                events[name] = events[name].filter(cb => cb !== callback)

                if (events[name].length === 0) {
                    delete events[name]
                }
            }
        },
        once(name: string, callback: YpEventCb) {
            const wrapCallback = (res: any) => {
                this.off(name, wrapCallback)
                callback(res)
            }
            this.on(name, wrapCallback)
        },
        clear() {
            events = {}
        }
    }
}
export default myEvents()
