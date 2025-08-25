self.onmessage = (e) => {
    // const { data, method } = e.data || "";
    // const result = method(data);
    const result = [{ a: 12 }];
    self.postMessage(result);
};
