import { useEffect, useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button';
import AddCar from "./AddCar";
import EditCar from "./EditCar";
import { fetchCars } from "../carapi";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function Carlist() {
    const [cars, setCars] = useState([]);

    const [colDef] = useState([
        { field: 'brand', filter: true },
        { field: 'model', filter: true },
        { field: 'color', filter: true },
        { field: 'fuel', filter: true, width: 100 },
        { field: 'modelYear', filter: true, width: 100 },
        { field: 'price', filter: true, width: 100 },
        {
            cellRenderer: params => <EditCar data={params.data} updateCar={updateCar} />,
            width: 120
        },
        { 
            cellRenderer: params => 
                <Button size="small" color="error" onClick={() => deleteCar(params.data._links.car.href)}>
                    Delete
                </Button>
            , width: 120
        },
    ]);

    useEffect(() => {
        handleFetch();
    }, []);

    const handleFetch = () => {
        fetchCars()
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.error(err))
    }

    const deleteCar = (url) => {
        if (window.confirm("Are you sure?")) {
            fetch(url, { method: 'DELETE' })
            .then(response => {
                if (!response.ok)
                    throw new Error("Error in deletion: " + response.statusText);
                
                return response.json();
            })
            .then(() => handleFetch())
            .catch(err => console.error(err))
        }
    }

    const addCar = (newCar) => {
        fetch(import.meta.env.VITE_API_URL, {
            method: 'POST',
            headers: {'content-type':'application/json'},
            body: JSON.stringify(newCar)
        })
        .then(response => {
            if (!response.ok)
                throw new Error("Error when adding car: " + response.statusText);

            return response.json();
        })
        .then(() => handleFetch())
        .catch(err => console.error(err))
    }

    const updateCar = (url, updatedCar) => {
        fetch(url, {
            method: 'PUT',
            headers: {'content-type' : 'application/json'},
            body: JSON.stringify(updatedCar)
        })
        .then(response => {
            if (!response.ok)
                throw new Error("Error whan updating: " + response.statusText)
            
            return response.json();
        })
        .then(() => handleFetch())
        .catch(err => console.error(err))
    }

    return(
        <>
            <AddCar addCar={addCar} />
            <div className="ag-theme-material" style={{ height: 600 }}>
                <AgGridReact 
                    rowData={cars}
                    columnDefs={colDef}
                    pagination={true}
                    paginationAutoPageSize={true}
                    suppressCellFocus={true}
                />
            </div>
        </>
    );
}

export default Carlist;