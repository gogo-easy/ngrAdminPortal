
// 构造一个事件中心解决兄弟组件通信问题,

export class EventEmitter {
  constructor() {
    this.events = Object.create(null);
  }
  on(eventName, handler) {
    if (!handler) {
      console.warn(`You must define a handler to handle event ${eventName} !`);
      return;
    }
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
    console.warn(`You define the handler ${handler.name} to handle event ${eventName} successfully!`);
  }

  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      console.warn(`Event ${eventName} does not have any handler!`);
    } else {
      for (let handler of this.events[eventName]) {
        handler.apply(this, args);
      }
    }
  }

  // 事件移除,
  off(eventName, handler) {
    if (this.events[eventName]) {
      if (!handler) {
        this.events[eventName] = undefined;
        console.warn(`Event ${eventName}'s all handlers has been removed !`);
      } else {
        const handles = this.events[eventName];
        handles.splice(handles.findIndex(el => el === handler), 1);
        console.warn(`Event ${eventName}'s handler ${handler.name} has been removed !`);
      }
      return;
    }
    console.warn(`Event ${eventName} has not been defined !`);
  }

  // 注册事件只调用一次
  once(eventName, handler) {

  }
}