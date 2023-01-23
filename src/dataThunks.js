import { createAsyncThunk } from "@reduxjs/toolkit";

export const loadHistory = createAsyncThunk(
    'data/loadHistory',
    async (props, { dispatch }) => {
        try {
            const response = await fetch('http://localhost:8080/api/get-history',{
                method: "post",
                headers: { 
                    "Content-Type": "application/json",
                },
            }).then(res=>{
                if(res.status!==200) throw Error(`${res.status}`);
                return res;
            }).then(res=>res.json());
            return response;
        } catch (error) {
            return error;
        }
    }
);

export const sendData = createAsyncThunk(
    'data/sendData',
    async ({data}, { dispatch }) => {
        try {
            const requestBody = {
                date: new Date().toISOString(),
                ...data
            }
            const body = JSON.stringify(requestBody);
            const response = await fetch('http://localhost:8080/api/send-data',{
                method: "post",
                headers: { 
                    "Content-Type": "application/json",
                },
                body
            }).then(res=>{
                if(res.status!==200) throw Error(`${res.status}`);
                return res;
            }).then(res=>res.json());
            return response;
        } catch (error) {
            return error;
        }
    }
);