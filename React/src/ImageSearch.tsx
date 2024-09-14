import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from '@mui/material/CircularProgress';
import './App.css';

interface ImageResponse {
  imageUrl: string;
  id: string;
}

const ImageSearch: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [size, setSize] = useState<string>("256x256");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [animationClass, setAnimationClass] = useState<string>("");

  const handleSizeChange = (event: SelectChangeEvent) => {
    setSize(event.target.value as string);
  };

  const handleSearch = async () => {
    setError(null);
    setImageUrl(null);

    const apiUrl = process.env.REACT_APP_apiUrl as string;

    try {
      setLoading(true);
      const response = await axios.post<ImageResponse>(apiUrl+'generate-image', {
        prompt: prompt,
        size: size,
      });

      setLoading(false);

      if (response.data) {
        setImageUrl(response.data.imageUrl);
      } else {
        setError("No se encontró ninguna imagen.");
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      } else {
        console.error('Unknown error:', error);
      }
      setError("Ocurrió un error al buscar la imagen.");
    }
  };

  useEffect(() => {
    setAnimationClass("animation");
    const timer = setTimeout(() => {
      setAnimationClass("");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1 className={animationClass}>Generar Imagen</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <TextField
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ingresa un prompt..."
          style={{
            width: "600px",
            height: "fit-content",
            background: "white",
            fontSize: "14px",
          }}
        />
        <InputLabel id="simple-select-label">Tamaño</InputLabel>
        <Select
          labelId="simple-select-label"
          id="simple-select"
          value={size}
          label="size"
          onChange={handleSizeChange}
        >
          <MenuItem value={"256x256"}>256x256</MenuItem>
          <MenuItem value={"512x512"}>512x512</MenuItem>
          <MenuItem value={"1024x1024"}>1024x1024</MenuItem>
        </Select>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSearch}
          style={{ marginTop: "7px", marginLeft: "10px", padding: "10px 20px" }}
        >
          GO!
        </Button>
      </div>

      <div style={{ position: "relative", width: "100%", height: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {loading && (
          <div style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0)", 
            zIndex: 2 
          }}>
            <CircularProgress />
          </div>
        )}

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Imagen buscada"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain", 
              position: "relative", 
              zIndex: 1 
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ImageSearch;
