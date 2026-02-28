class IndexController {
    public async getIndex(req, res) {
        res.send({ message: "Welcome to the OpenAPI Swagger Project!" });
    }

    public async getHealth(req, res) {
        res.send({ status: "OK" });
    }
}

export default IndexController;