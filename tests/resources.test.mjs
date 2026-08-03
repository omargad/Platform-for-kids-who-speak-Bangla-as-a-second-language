import assert from "node:assert/strict";
import test from "node:test";

const { externalResources, resourceCategories } = await import("../app/resources-content.ts");

test("external resources are complete, bilingual and unique", () => {
  assert.ok(externalResources.length >= 10, "all supplied providers listed");
  const urls = new Set();
  const categoryIds = new Set(resourceCategories.map((category) => category.id));
  for (const resource of externalResources) {
    assert.ok(resource.name.trim(), "resource needs a name");
    assert.match(resource.url, /^https:\/\//, `${resource.name}: must be https`);
    assert.ok(!urls.has(resource.url), `${resource.name}: duplicate url`);
    urls.add(resource.url);
    assert.ok(categoryIds.has(resource.category), `${resource.name}: unknown category`);
    for (const field of [resource.location, resource.description]) {
      assert.ok(field.en.trim() && field.bn.trim(), `${resource.name}: missing bilingual text`);
    }
  }
});

test("every category used has a bilingual heading", () => {
  for (const category of resourceCategories) {
    assert.ok(category.title.en && category.title.bn, `${category.id}: missing title`);
    assert.ok(category.note.en && category.note.bn, `${category.id}: missing note`);
  }
});
