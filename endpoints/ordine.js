function endpoint(app, connpool) {

    app.post("/api/ordine", (req, res) => {
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
            clienteFK: req.body.clienteFK,
            fornitoreFK: req.body.fornitoreFK,
            prodottoFK: req.body.prodottoFK,
            quantita: req.body.quantita,
        }

        var sql = 'INSERT INTO ordine (clienteFK, fornitoreFK, prodottoFK, quantita) VALUES (?,?,?,?)'
        var params = [data.clienteFK, data.fornitoreFK, data.prodottoFK, data.quantita]
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



    app.get("/api/ordine", (req, res, next) => {
        var sql = "select * from ordine"
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


    app.get("/api/ordine/:id", (req, res) => {
        var sql = "select * from ordine where idOrdine = ?"
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


    app.put("/api/ordine/:id", (req, res) => {
        var data = {
            nome: req.body.nome,
        }
        connpool.execute(
            `UPDATE ordine set 
               clienteFK = COALESCE(?,clienteFK)
               fornitoreFK = COALESCE(?,fornitoreFK)
               prodottoFK = COALESCE(?,prodottoFK)
               quantita = COALESCE(?,quantita)
               WHERE idOrdine = ?`,
            [data.clienteFK, data.fornitoreFK, data.prodottoFK, data.quantita, req.params.id],
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



    app.delete("/api/ordine/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM ordine WHERE idOrdine = ?',
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