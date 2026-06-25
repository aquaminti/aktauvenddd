const Machine = require('../models/Machine');
const fallbackMachines = require('../database/seedData').machines;
const { isDatabaseConnected } = require('../database/connection');

function buildPhotoListFromStatic(machine) {
  const photos = [];
  for (let i = 1; i <= machine.photosCount; i += 1) {
    photos.push(`/images/${machine.photosFolder}/${machine.photosFolder}.${i}.png`);
  }
  return {
    id: machine.machineId,
    machineId: machine.machineId,
    address: machine.address,
    district: machine.district,
    description: machine.description,
    lat: machine.lat,
    lng: machine.lng,
    status: machine.status,
    photosFolder: machine.photosFolder,
    photosCount: machine.photosCount,
    photos,
  };
}

async function getMachinesList({ search, district, includeInactive = false } = {}) {
  if (!isDatabaseConnected()) {
    let result = fallbackMachines.map(buildPhotoListFromStatic);
    if (!includeInactive) {
      result = result.filter((m) => m.status === 'active');
    }
    if (district) {
      result = result.filter((m) => m.district === district);
    }
    if (search) {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.address.toLowerCase().includes(query) ||
          m.district.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query)
      );
    }
    return result;
  }

  const filter = includeInactive ? {} : { status: 'active' };
  if (district) filter.district = district;

  let docs = await Machine.find(filter).sort({ machineId: 1 });

  if (search) {
    const query = search.toLowerCase().trim();
    docs = docs.filter(
      (m) =>
        m.address.toLowerCase().includes(query) ||
        m.district.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query)
    );
  }

  return docs.map((m) => m.toPublicObject());
}

async function listMachines(req, res, next) {
  try {
    const { search, district } = req.query;
    const machines = await getMachinesList({ search, district });
    res.json({ success: true, count: machines.length, machines });
  } catch (err) {
    next(err);
  }
}

async function getMachineById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (isDatabaseConnected()) {
      const machine = await Machine.findOne({ machineId: id });
      if (!machine) {
        return res.status(404).json({ success: false, message: 'Автомат с таким ID не найден' });
      }
      return res.json({ success: true, machine: machine.toPublicObject() });
    }

    const machine = fallbackMachines.find((m) => m.machineId === id);
    if (!machine) {
      return res.status(404).json({ success: false, message: 'Автомат с таким ID не найден' });
    }
    res.json({ success: true, machine: buildPhotoListFromStatic(machine) });
  } catch (err) {
    next(err);
  }
}

async function createMachine(req, res, next) {
  try {
    const { address, district, description, lat, lng, status, photosCount } = req.body;

    const last = await Machine.findOne().sort({ machineId: -1 });
    const machineId = last ? last.machineId + 1 : 1;

    const machine = await Machine.create({
      machineId,
      address,
      district,
      description: description || '',
      lat,
      lng,
      status: status || 'active',
      photosFolder: String(machineId),
      photosCount: photosCount || 0,
    });

    res.status(201).json({ success: true, machine: machine.toPublicObject() });
  } catch (err) {
    next(err);
  }
}

async function updateMachine(req, res, next) {
  try {
    const id = Number(req.params.id);
    const machine = await Machine.findOne({ machineId: id });

    if (!machine) {
      return res.status(404).json({ success: false, message: 'Автомат не найден' });
    }

    const { address, district, description, lat, lng, status, photosCount } = req.body;

    if (address !== undefined) machine.address = address;
    if (district !== undefined) machine.district = district;
    if (description !== undefined) machine.description = description;
    if (lat !== undefined) machine.lat = lat;
    if (lng !== undefined) machine.lng = lng;
    if (status !== undefined) machine.status = status;
    if (photosCount !== undefined) machine.photosCount = photosCount;

    await machine.save();
    res.json({ success: true, machine: machine.toPublicObject() });
  } catch (err) {
    next(err);
  }
}

async function deleteMachine(req, res, next) {
  try {
    const id = Number(req.params.id);
    const machine = await Machine.findOneAndDelete({ machineId: id });

    if (!machine) {
      return res.status(404).json({ success: false, message: 'Автомат не найден' });
    }

    res.json({ success: true, message: 'Точка автомата удалена' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMachinesList,
  listMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
};
