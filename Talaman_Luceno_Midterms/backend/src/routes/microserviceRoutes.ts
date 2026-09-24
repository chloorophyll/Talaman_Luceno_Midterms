import { Router, Request, Response } from "express";
import { pool } from "../db";
import { Microservice } from "../types";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validateResource } from "../validate";
import { updateMicrosericeSchema, createMicroserviceSchema } from "../schema";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { search } = req.query;

  try {
    let queryText = 'SELECT * FROM microservice';
    const queryParams: (string | number)[] = [];

    if (search && typeof search === 'string') {
      queryText += ' WHERE name ILIKE $1';
      queryParams.push(`%${search}%`);
    }

    queryText += ' ORDER BY id ASC';

    const result = await pool.query<Microservice>(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { name, endpointUrl, environment, status, version, ownerEmail }: Microservice = req.body;
  console.log({ name, endpointUrl, environment, status, version, ownerEmail })
  try {
    const result = await pool.query(
      `INSERT INTO microservice (name, endpoint_url, environment, status, version, owner_email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, endpointUrl, environment, status, version, ownerEmail]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put(
  "/:id",
  authenticateToken,
  validateResource(updateMicrosericeSchema),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, endpointUrl, environment, status, version, ownerEmail } = req.body;
    try {
      let query = `UPDATE microservice SET`;
      const params = { name, endpointUrl, environment, status, version, ownerEmail };
      const presentParams = Object.fromEntries(
        Object.entries(params).filter(([_key, value]) => value)
      );
      query = Object.entries(presentParams).reduce((acc, [key, _value], i) => {
        return acc + ` ${key} = $${i + 1} `;
      }, query);

      query += ` WHERE id = $${Object.entries(presentParams).length + 1
        } RETURNING *`;

      const result = await pool.query(
        query,
        Object.values(presentParams).concat(id)
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Microservice not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

router.delete(
  '/:id',
  authenticateToken, 
  async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM microservice
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Microservice not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;