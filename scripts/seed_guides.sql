INSERT INTO public."guide" ("Name", "IsActive", "CreatedAt")
SELECT v."Name", true, NOW()
FROM (
    VALUES
        ('Prof. Carlos Mendez'),
        ('Chef Sofia Ramirez'),
        ('Biologist Ana Torres'),
        ('Dancer Miguel Fernandez'),
        ('Sommelier Lucia Gonzalez'),
        ('Architect Jorge Silva'),
        ('Anthropologist Elena Morales'),
        ('Artist Pablo Rojas'),
        ('Storyteller Isabel Vargas'),
        ('Dr. Maria Lopez')
) AS v("Name")
LEFT JOIN public."guide" g ON g."Name" = v."Name"
WHERE g."GuideId" IS NULL;
