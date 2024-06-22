import { Request, Response } from "express";
import pool from "../database";

class PaisController {
  public async lista(req: Request, res: Response) {
    const pais = await pool.query("SELECT * FROM Pais ORDER BY Nombre");
    res.json(pais);
  }

  public async crear(req: Request, res: Response) {
    /* await pool.query('INSERT INTO Pais SET ?', [req.body]); */

    const values = [
      req.body.Nombre,
      req.body.Nacionalidad,
      req.body.Continente,
      req.body.Bandera,
      req.body.Usuario,
    ];

    await pool.query("CALL crear_pais(?)", [values]);
    res.json({ message: "Se guardo un Pais" });
  }

  public async actualizar(req: Request, res: Response) {
    const { idPais } = req.params;
    /* await pool.query('UPDATE Pais SET ? WHERE idPais = ?', [req.body, idPais]); */
    const values = [
      req.body.Nombre,
      req.body.Nacionalidad,
      req.body.Continente,
      req.body.Bandera,
      req.body.Usuario,
    ];
    await pool.query("CALL actualizar_pais(?,?)", [idPais, values]);
    res.json({ message: "Se modifico un Pais" });
  }

  public async eliminar(req: Request, res: Response) {
    const { idPais } = req.params;
    const { Usuario } = req.params;
    /* await pool.query('DELETE FROM Pais WHERE idPais = ?', [idPais]); */
    await pool.query("CALL eliminar_pais(?,?)", [idPais, Usuario]);
    res.json({ message: "Se elimino un Pais" });
  }

  public async buscar(req: Request, res: Response) {
    const { idPais } = req.params;
    const album = await pool.query("SELECT * FROM Pais WHERE idPais = ?", [
      idPais,
    ]);
    if (album.length > 0) {
      return res.json(album[0]);
    }
    res.status(404).json({ message: "No existe el Pais" });
  }
}

const paisController = new PaisController(); //devuelve un objeto
export default paisController; //importa la instancia
