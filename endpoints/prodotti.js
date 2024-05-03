function endpoint(app, connpool) {

    app.post("/api/prodotti", (req, res) => {
        var errors = []
        /* controllo dati inseriti
        if (!req.body.description) {
            errors.push("No description specified");
        }
        if (req.body.status === "") {
            errors.push("No status specified");
        }
        */
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        var data = {
            descrizione: req.body.descrizione,
            compatibile: req.body.compatibile,
        }

        var sql = 'INSERT INTO prodotto (descrizione,compatibile) VALUES (?,?)'
        var params = [data.descrizione]
        var params = [data.compatibile]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.insertID
            })
            console.log(results)
        });

    })



    app.get("/api/prodotti", (req, res, next) => {
        var sql = "select * from prodotto"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    });


    app.get("/api/prodotti/:id", (req, res) => {
        var sql = "select * from prodotto where idProdotto = ?"
        var params = [req.params.id]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows[0]
            })
        });
    });


    app.put("/api/prodotti/:id", (req, res) => {
        var data = {
            descrizione: req.body.descrizione,
            compatibile: req.body.compatibile,
        }
        connpool.execute(
            `UPDATE prodotto set 
               descrizione = COALESCE(?,descrizione)
               compatibile = COALESCE(?,compatibile)
               WHERE idProdotto = ?`,
            [data.descrizione, data.compatibile, req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
                console.log(result)
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
            });
    })



    app.delete("/api/prodotti/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM prodotti WHERE idProdotto = ?',
            [req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
                res.json({ "message": "deleted", changes: result.affectedRows })
            });
    })


}





module.exports = endpoint;