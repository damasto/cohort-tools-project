const chai = require("chai");
const chaiHttp = require("chai-http")
const assert = chai.assert;

const { app } = require("../app");
chai.use(chaiHttp)

describe("send doc file", () => {
    it("should send docs.html file", (done) => {
        chai
            .request(app)
            .get("docs")
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
            })

    })
})
