const request = require("supertest");
const app = require("../../app");
const Cohort = require("../../models/Cohort.models");
const cohortsData = require("../../cohorts.json");


describe("Cohort Controller", () => {
  describe("GET /api/cohorts - with data", () => {

    beforeEach(async () => {
      await Cohort.insertMany(cohortsData);
    });

    it("should return 200 and all cohorts", async () => {

      const res = await request(app)
        .get("/api/cohorts")
        .set("content-type", "application/json");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.headers["content-type"]).toMatch(/json/)

      res.body.forEach(cohort => {
        expect(cohort).toHaveProperty("cohortSlug");
        expect(cohort).toHaveProperty("cohortName");
        expect(cohort).toHaveProperty("program");
        expect(cohort).toHaveProperty("format");
        expect(cohort).toHaveProperty("campus");
        expect(cohort).toHaveProperty("startDate");
        expect(cohort).toHaveProperty("endDate");
        expect(cohort).toHaveProperty("inProgress");
        expect(cohort).toHaveProperty("programManager");
        expect(cohort).toHaveProperty("leadTeacher");
        expect(cohort).toHaveProperty("totalHours");
      })
    });
  });
})