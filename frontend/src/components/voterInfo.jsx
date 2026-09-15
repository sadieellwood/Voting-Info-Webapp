import api from "../api.js";
import React, { useEffect, useState } from 'react';

const VoterInfo = () => {
    const [info, setInfo] = useState("");

    const fetchVoterInfo = async () => {
        try {
            const response = await api.get('/info');
            setInfo(JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching info", error);
        }
    };

    useEffect(() => {
        fetchVoterInfo();
      }, []);

    return (
    <div>
        <h2>Voter Info</h2>
        <pre>{info}</pre>
    </div>
    );
};

export default VoterInfo;

