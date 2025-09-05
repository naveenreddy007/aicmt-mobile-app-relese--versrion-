import { NextResponse } from "next/server"

// Conversion factors for environmental impact calculations
const IMPACT_FACTORS = {
  bags: {
    conventional: {
      co2PerUnit: 0.04, // kg CO2 per bag
      wastePerUnit: 0.01, // kg waste per bag
      oilPerUnit: 0.07, // liters of oil per bag
      waterPerUnit: 0.5, // liters of water per bag
    },
    compostable: {
      co2PerUnit: 0.02, // kg CO2 per bag
      wastePerUnit: 0.0, // kg waste per bag (fully biodegradable)
      oilPerUnit: 0.02, // liters of oil per bag
      waterPerUnit: 0.8, // liters of water per bag
    },
  },
  packaging: {
    conventional: {
      co2PerUnit: 0.08, // kg CO2 per unit
      wastePerUnit: 0.02, // kg waste per unit
      oilPerUnit: 0.1, // liters of oil per unit
      waterPerUnit: 1.2, // liters of water per unit
    },
    compostable: {
      co2PerUnit: 0.04, // kg CO2 per unit
      wastePerUnit: 0.0, // kg waste per unit
      oilPerUnit: 0.03, // liters of oil per unit
      waterPerUnit: 1.5, // liters of water per unit
    },
  },
  films: {
    conventional: {
      co2PerUnit: 0.06, // kg CO2 per unit
      wastePerUnit: 0.015, // kg waste per unit
      oilPerUnit: 0.09, // liters of oil per unit
      waterPerUnit: 0.8, // liters of water per unit
    },
    compostable: {
      co2PerUnit: 0.03, // kg CO2 per unit
      wastePerUnit: 0.0, // kg waste per unit
      oilPerUnit: 0.025, // liters of oil per unit
      waterPerUnit: 1.0, // liters of water per unit
    },
  },
}

// Frequency multipliers for annual calculations
const FREQUENCY_MULTIPLIERS = {
  once: 1,
  monthly: 12,
  quarterly: 4,
  yearly: 1,
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    const { productType, quantity, frequency } = data

    if (!productType || !quantity || !frequency) {
      return NextResponse.json(
        { error: "Missing required fields: productType, quantity, and frequency are required" },
        { status: 400 },
      )
    }

    if (!IMPACT_FACTORS[productType]) {
      return NextResponse.json(
        { error: `Invalid product type: ${productType}. Valid types are: ${Object.keys(IMPACT_FACTORS).join(", ")}` },
        { status: 400 },
      )
    }

    if (!FREQUENCY_MULTIPLIERS[frequency]) {
      return NextResponse.json(
        {
          error: `Invalid frequency: ${frequency}. Valid frequencies are: ${Object.keys(FREQUENCY_MULTIPLIERS).join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Calculate annual quantity
    const annualQuantity = quantity * FREQUENCY_MULTIPLIERS[frequency]

    // Calculate impact for conventional plastics
    const conventional = IMPACT_FACTORS[productType].conventional
    const conventionalImpact = {
      co2: conventional.co2PerUnit * annualQuantity,
      waste: conventional.wastePerUnit * annualQuantity,
      oil: conventional.oilPerUnit * annualQuantity,
      water: conventional.waterPerUnit * annualQuantity,
    }

    // Calculate impact for compostable plastics
    const compostable = IMPACT_FACTORS[productType].compostable
    const compostableImpact = {
      co2: compostable.co2PerUnit * annualQuantity,
      waste: compostable.wastePerUnit * annualQuantity,
      oil: compostable.oilPerUnit * annualQuantity,
      water: compostable.waterPerUnit * annualQuantity,
    }

    // Calculate savings
    const savings = {
      co2: conventionalImpact.co2 - compostableImpact.co2,
      waste: conventionalImpact.waste - compostableImpact.waste,
      oil: conventionalImpact.oil - compostableImpact.oil,
      water: conventionalImpact.water - compostableImpact.water,
    }

    // Calculate equivalent metrics
    const equivalents = {
      treesPlanted: Math.round(savings.co2 / 21), // Approx 21kg CO2 absorbed by one tree annually
      plasticBottles: Math.round(savings.waste / 0.01), // Approx 10g per plastic bottle
      carMiles: Math.round(savings.co2 * 4), // Approx 0.25kg CO2 per mile
      showerMinutes: Math.round(savings.water / 10), // Approx 10L per minute of shower
    }

    return NextResponse.json({
      annualQuantity,
      conventional: conventionalImpact,
      compostable: compostableImpact,
      savings,
      equivalents,
    })
  } catch (error) {
    console.error("Error calculating environmental impact:", error)
    return NextResponse.json({ error: "Failed to calculate environmental impact" }, { status: 500 })
  }
}
