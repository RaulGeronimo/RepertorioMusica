import { Request, Response } from "express";
import pool from "../database";

class InstrumentoController{
    public async lista(req: Request, res: Response){
        const album = await pool.query('SELECT * FROM Instrumento ORDER BY Nombre');
        /* const album = await pool.query('SELECT idInstrumento, Nombre, Foto, LEFT(Descripcion, 100) AS Descripcion FROM Instrumento ORDER BY Nombre'); */
        res.json(album);
    }

    public async crear(req: Request, res:Response){
        /* await pool.query('INSERT INTO Instrumento SET ?', [req.body]); */
        const values = [
            req.body.Nombre,
            req.body.Descripcion,
            req.body.Foto,
            req.body.Usuario,
          ];
          await pool.query('CALL crear_instrumento(?)', [values]);
        res.json({message: 'Se guardo un Instrumento'});
    }

    public async actualizar(req: Request, res: Response){
        const { idInstrumento } = req.params;
        /* await pool.query('UPDATE Instrumento SET ? WHERE idInstrumento = ?', [req.body, idInstrumento]); */
        const values = [
            req.body.Nombre,
            req.body.Descripcion,
            req.body.Foto,
            req.body.Usuario,
          ];
        await pool.query("CALL actualizar_instrumento(?,?)", [idInstrumento, values]);
        res.json({message: 'Se modifico un Instrumento'});
    }

    public async eliminar(req: Request, res: Response){
        const { idInstrumento } = req.params;
        const { Usuario } = req.params;
        //await pool.query('DELETE FROM Instrumento WHERE idInstrumento = ?', [idInstrumento]);
        await pool.query("CALL eliminar_instrumento(?,?)", [idInstrumento, Usuario]);
        res.json({message: 'Se elimino un Instrumento'});
    }

    public async buscar(req: Request, res: Response){
        const { idInstrumento } = req.params;
        const album = await pool.query('SELECT * FROM Instrumento WHERE idInstrumento = ?', [idInstrumento]);
        if(album.length > 0){
            return res.json(album[0]);
        }
        res.status(404).json({message: 'No existe el Instrumento'});
    }
}

const instrumentoController = new InstrumentoController(); //devuelve un objeto
export default instrumentoController; //importa la instancia