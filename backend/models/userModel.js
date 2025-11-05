import { sql } from '../config/ConnectDatabase.js';

const selectableColumns = sql`
  "UserId",
  "Name",
  "Email",
  "PhoneNumber",
  "CreationDate",
  "LastLogin",
  "IsActive"
`;

const findAllUsers = async () => {
  return sql`
    SELECT ${selectableColumns}
    FROM public."user"
    ORDER BY "UserId" ASC
  `;
};

const findUserById = async (id) => {
  const [row] = await sql`
    SELECT ${selectableColumns}
    FROM public."user"
    WHERE "UserId" = ${id}
  `;
  return row ?? null;
};

const findUserByEmailWithPassword = async (email) => {
  const [row] = await sql`
    SELECT *
    FROM public."user"
    WHERE "Email" = ${email}
    LIMIT 1
  `;
  return row ?? null;
};

const insertUser = async (payload) => {
  const {
    Name,
    Email,
    Password,
    PhoneNumber = null,
    CreationDate = new Date(),
    LastLogin = null,
    IsActive = true,
  } = payload;

  const [row] = await sql`
    INSERT INTO public."user" ("Name", "Email", "Password", "PhoneNumber", "CreationDate", "LastLogin", "IsActive")
    VALUES (${Name}, ${Email}, ${Password}, ${PhoneNumber}, ${CreationDate}, ${LastLogin}, ${IsActive})
    RETURNING ${selectableColumns}
  `;
  return row;
};

const updateUserById = async (id, updates) => {
  const allowedKeys = new Set(['Name', 'Email', 'Password', 'PhoneNumber', 'CreationDate', 'LastLogin', 'IsActive']);
  const entries = Object.entries(updates).filter(([key, value]) => allowedKeys.has(key) && value !== undefined);

  if (!entries.length) {
    return findUserById(id);
  }

  const assignments = entries.map(([key, value]) => sql`${sql(key)} = ${value}`);

  const [row] = await sql`
    UPDATE public."user"
    SET ${sql(assignments)}
    WHERE "UserId" = ${id}
    RETURNING ${selectableColumns}
  `;
  return row ?? null;
};

const deleteUserById = async (id) => {
  const result = await sql`
    DELETE FROM public."user"
    WHERE "UserId" = ${id}
  `;
  return Number(result.count ?? 0);
};

export {
  findAllUsers,
  findUserById,
  findUserByEmailWithPassword,
  insertUser,
  updateUserById,
  deleteUserById,
};
