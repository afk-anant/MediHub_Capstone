const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/user');

const dummyDoctors = [
  {
    name: 'Richard James',
    email: 'richard.james@prescripto.com',
    password: 'doctor123',
    role: 'DOCTOR',
    specialization: 'General Physician',
    about: 'Dr. Richard has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine and patient wellness.',
    phone: '+1 234 567 8901',
    address: '123 Medical Center, New York, NY',
    image: 'https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc1.png',
    fee: 500,
    experience: '4 Years',
    degree: 'MBBS'
  },
  {
    name: 'Emily Larson',
    email: 'emily.larson@prescripto.com',
    password: 'doctor123',
    role: 'DOCTOR',
    specialization: 'Gynecologist',
    about: 'Dr. Emily Larson is a dedicated gynecologist with expertise in women\'s health, prenatal care, and reproductive medicine.',
    phone: '+1 234 567 8902',
    address: '456 Women\'s Health Clinic, Los Angeles, CA',
    image: 'https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc2.png',
    fee: 600,
    experience: '3 Years',
    degree: 'MBBS, MD'
  },
  {
    name: 'Sarah Patel',
    email: 'sarah.patel@prescripto.com',
    password: 'doctor123',
    role: 'DOCTOR',
    specialization: 'Dermatologist',
    about: 'Dr. Sarah Patel specializes in dermatology and skin care treatments, with a focus on both medical and cosmetic dermatology.',
    phone: '+1 234 567 8903',
    address: '789 Skin Care Center, Chicago, IL',
    image: 'https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc3.png',
    fee: 300,
    experience: '1 Year',
    degree: 'MBBS, MD (Dermatology)'
  },
  {
    name: 'Christopher Lee',
    email: 'christopher.lee@prescripto.com',
    password: 'doctor123',
    role: 'DOCTOR',
    specialization: 'Pediatrician',
    about: 'Dr. Christopher Lee is passionate about pediatric care and child development, providing comprehensive healthcare for children.',
    phone: '+1 234 567 8904',
    address: '321 Children\'s Hospital, Houston, TX',
    image: 'https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc4.png',
    fee: 500,
    experience: '2 Years',
    degree: 'MBBS, MD (Pediatrics)'
  },
  {
    name: 'Jennifer Garcia',
    email: 'jennifer.garcia@prescripto.com',
    password: 'doctor123',
    role: 'DOCTOR',
    specialization: 'Neurologist',
    about: 'Dr. Jennifer Garcia has extensive experience in neurology and brain health, specializing in neurological disorders and treatments.',
    phone: '+1 234 567 8905',
    address: '654 Neuro Center, Phoenix, AZ',
    image: 'https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc5.png',
    fee: 500,
    experience: '4 Years',
    degree: 'MBBS, MD (Neurology)'
  },
  {
    name: 'Andrew Williams',
    email: 'andrew.williams@prescripto.com',
    password: 'doctor123',
    role: 'DOCTOR',
    specialization: 'Gastroenterologist',
    about: 'Dr. Andrew Williams specializes in digestive health and gastroenterology, treating conditions of the digestive system.',
    phone: '+1 234 567 8906',
    address: '987 Digestive Health Clinic, Philadelphia, PA',
    image: 'https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc6.png',
    fee: 400,
    experience: '4 Years',
    degree: 'MBBS, MD (Gastroenterology)'
  },
  {
    name: 'Timothy White',
    email: 'timothy.white@prescripto.com',
    password: 'doctor123',
    role: 'DOCTOR',
    specialization: 'General Physician',
    about: 'Dr. Timothy White provides comprehensive primary care services with a patient-centered approach to healthcare.',
    phone: '+1 234 567 8907',
    address: '147 Primary Care, San Antonio, TX',
    image: 'https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc8.png',
    fee: 500,
    experience: '4 Years',
    degree: 'MBBS'
  },
  {
    name: 'Ava Mitchell',
    email: 'ava.mitchell@prescripto.com',
    password: 'doctor123',
    role: 'DOCTOR',
    specialization: 'Dermatologist',
    about: 'Dr. Ava Mitchell is an expert in cosmetic and medical dermatology, helping patients achieve healthy and beautiful skin.',
    phone: '+1 234 567 8908',
    address: '258 Dermatology Clinic, San Diego, CA',
    image: 'https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc9.png',
    fee: 300,
    experience: '1 Year',
    degree: 'MBBS, MD (Dermatology)'
  }
];

async function seedDoctors() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing doctors
    await User.deleteMany({ role: 'DOCTOR' });
    console.log('Cleared existing doctors');

    // Hash passwords and insert doctors
    for (const doctor of dummyDoctors) {
      const hashedPassword = await bcrypt.hash(doctor.password, 10);
      await User.create({
        ...doctor,
        password: hashedPassword
      });
      console.log(`Created doctor: ${doctor.name}`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding doctors:', error);
    process.exit(1);
  }
}

seedDoctors();
