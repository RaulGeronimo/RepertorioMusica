import { Request, Response } from "express";
import pool from "../database";

class CancionesController {
  public async lista(req: Request, res: Response) {
    const canciones = await pool.query("SELECT * FROM Vista_Canciones");
    res.json(canciones);
  }

  public async crear(req: Request, res: Response) {
    //await pool.query('INSERT INTO Canciones SET ?', [req.body]);

    const values = [
      req.body.Nombre,
      req.body.Duracion,
      req.body.Publicacion,
      req.body.Genero,
      req.body.Interpretacion,
      req.body.idGrupo,
      req.body.Usuario,
    ];

    await pool.query("CALL crear_canciones(?)", [values]);
    res.json({ message: "Se guardo una Cancion" });
  }

  public async actualizar(req: Request, res: Response) {
    const { idCancion } = req.params;
    //await pool.query('UPDATE Canciones SET ? WHERE idCancion = ?', [req.body, idCancion]);
    const values = [
      req.body.Nombre,
      req.body.Duracion,
      req.body.Publicacion,
      req.body.Genero,
      req.body.Interpretacion,
      req.body.idGrupo,
      req.body.Usuario,
    ];

    await pool.query("CALL actualizar_canciones(?,?)", [idCancion, values]);
    res.json({ message: "Se modifico una Cancion" });
  }

  public async eliminar(req: Request, res: Response) {
    const { idCancion } = req.params;
    //await pool.query('DELETE FROM Canciones WHERE idCancion = ?', [idCancion]);

    const { Usuario } = req.params;
    await pool.query("CALL eliminar_canciones(?,?)", [idCancion, Usuario]);

    res.json({ message: "Se elimino una Cancion" });
  }

  public async buscar(req: Request, res: Response) {
    const { idCancion } = req.params;
    const canciones = await pool.query(
      "SELECT *, DATE_FORMAT(Publicacion, '%Y-%m-%d') AS Publicacion FROM Canciones WHERE idCancion = ?",
      [idCancion]
    );
    if (canciones.length > 0) {
      return res.json(canciones[0]);
    }
    res.status(404).json({ message: "No existe la Cancion" });
  }
}

const cancionesController = new CancionesController(); //devuelve un objeto
export default cancionesController; //importa la instancia
