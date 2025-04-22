import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../services/api';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  value: yup
    .number()
    .required('Value is required')
    .min(0, 'Value must be greater than or equal to 0'),
  barbershop_id: yup.number().required('Barbershop is required'),
});

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(!!id);

  const formik = useFormik({
    initialValues: {
      name: '',
      value: '',
      barbershop_id: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await api.put(`/services/${id}`, values);
        } else {
          await api.post('/services', values);
        }
        navigate('/services');
      } catch (error) {
        console.error('Error saving service:', error);
      }
    },
  });

  useEffect(() => {
    if (isEditing) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    try {
      const response = await api.get(`/services/${id}`);
      formik.setValues({
        name: response.data.name,
        value: response.data.value,
        barbershop_id: response.data.barbershop_id,
      });
    } catch (error) {
      console.error('Error loading service:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isEditing ? 'Edit Service' : 'New Service'}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="value"
                name="value"
                label="Value"
                type="number"
                value={formik.values.value}
                onChange={formik.handleChange}
                error={formik.touched.value && Boolean(formik.errors.value)}
                helperText={formik.touched.value && formik.errors.value}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="barbershop_id"
                name="barbershop_id"
                label="Barbershop ID"
                type="number"
                value={formik.values.barbershop_id}
                onChange={formik.handleChange}
                error={
                  formik.touched.barbershop_id &&
                  Boolean(formik.errors.barbershop_id)
                }
                helperText={
                  formik.touched.barbershop_id && formik.errors.barbershop_id
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/services')}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ServiceForm; 