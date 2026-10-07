import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { projects } from "../src/data/projects";
import projectImagesMap from "../src/data/project-images.json";

describe("Featured Projects & Gallery Data Tests", () => {
  it("should have all registered projects with required fields", () => {
    assert.ok(Array.isArray(projects), "projects should be an array");
    assert.ok(projects.length >= 3, "should have at least 3 featured projects");

    for (const project of projects) {
      assert.ok(project.slug, `project ${project.title} must have a slug`);
      assert.ok(project.title, `project ${project.slug} must have a title`);
      assert.ok(project.problem, `project ${project.slug} must have a problem description`);
      assert.ok(project.role, `project ${project.slug} must have a role description`);
      assert.ok(project.result, `project ${project.slug} must have a result description`);
      assert.ok(Array.isArray(project.stack), `project ${project.slug} must have stack array`);
      assert.ok(project.stack.length > 0, `project ${project.slug} stack must not be empty`);
    }
  });

  it("should have project-images.json mapping each registered slug", () => {
    const imagesRecord = projectImagesMap as Record<string, string[]>;
    assert.ok(imagesRecord, "project-images.json must be a valid JSON object");

    for (const project of projects) {
      assert.ok(
        project.slug in imagesRecord,
        `Slug "${project.slug}" must be present in project-images.json`
      );
      assert.ok(
        Array.isArray(imagesRecord[project.slug]),
        `Images for "${project.slug}" must be an array`
      );
    }
  });

  it("should naturally sort image filenames (e.g. 1.png, 2.png ... 10.png)", () => {
    const naturalSort = (a: string, b: string) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

    const unsorted = [
      "10.png",
      "1.png",
      "2.png",
      "screenshot-20.jpg",
      "screenshot-3.jpg",
      "screenshot-1.jpg",
    ];

    const sorted = [...unsorted].sort(naturalSort);

    assert.deepStrictEqual(sorted, [
      "1.png",
      "2.png",
      "10.png",
      "screenshot-1.jpg",
      "screenshot-3.jpg",
      "screenshot-20.jpg",
    ]);
  });

  it("should ensure copied public image paths exist or gracefully fallback to empty array", () => {
    const imagesRecord = projectImagesMap as Record<string, string[]>;

    for (const project of projects) {
      const imgList = imagesRecord[project.slug];
      if (imgList && imgList.length > 0) {
        for (const imgPath of imgList) {
          assert.ok(
            imgPath.startsWith(`/projects/${project.slug}/`),
            `Image path ${imgPath} should start with /projects/${project.slug}/`
          );
          // Check that file actually exists in public/
          const diskPath = path.join(process.cwd(), "public", imgPath.replace(/^\//, ""));
          assert.ok(
            fs.existsSync(diskPath),
            `Referenced file on disk must exist: ${diskPath}`
          );
        }
      }
    }
  });
});
