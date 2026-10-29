import { useTranslation } from 'react-i18next'
import { formatLap, formatNumber } from '@/lib/format'
import type { Version } from '@/types/catalog'
import { Link } from 'react-router'

type TechSheetProps = {
  version: Version | undefined
}

type Row = {
  key: string
  label: string
  value: string | null
  /** Se presente, il valore porta a un'altra pagina */
  to?: string
}

/**
 * La scheda tecnica completa della versione, divisa in sezioni.
 * Le righe senza dato non compaiono, e una sezione vuota sparisce.
 */
export function TechSheet({ version }: TechSheetProps) {
  const { t, i18n } = useTranslation()

  if (!version) {
    return null
  }

  const lang = i18n.language
  // Un numero con la sua unità, o null se manca: la riga verrà nascosta
  const num = (value: number | null | undefined, unit = '', decimals = 0) =>
    value == null
      ? null
      : `${formatNumber(value, lang, decimals)}${unit ? ` ${unit}` : ''}`

  const { specs, powertrain, production, years } = version
  const engine = powertrain?.engine
  const transmission = powertrain?.transmission

  const architecture = engine
    ? engine.architecture === 'V' && engine.v_angle_deg !== null
      ? t('model.sheet.vAngle', {
          layout: t('model.layouts.V', { cylinders: engine.cylinders }),
          angle: engine.v_angle_deg,
        })
      : t(`model.layouts.${engine.architecture}`, {
          cylinders: engine.cylinders,
        })
    : null

  const gearbox = transmission?.gearbox_type
    ? [
        t(`model.sheet.gearboxes.${transmission.gearbox_type}`),
        transmission.gears !== null
          ? t('model.sheet.gears', { count: transmission.gears })
          : null,
      ]
        .filter(Boolean)
        .join(', ')
    : null

  const productionValue =
    production.units !== null
      ? t('model.units', { count: production.units })
      : production.type
        ? t(`model.productionTypes.${production.type}`)
        : null

  const yearsValue = years.in_production
    ? t('model.since', { start: years.start })
    : years.end !== null && years.end !== years.start
      ? t('model.range', { start: years.start, end: years.end })
      : String(years.start)

  const sections: { key: string; title: string; rows: Row[] }[] = [
    {
      key: 'powertrain',
      title: t('model.sheet.sections.powertrain'),
      rows: [
        {
          key: 'engineCode',
          label: t('model.sheet.rows.engineCode'),
          value: engine?.code ?? null,
          to: engine ? `/motori/${engine.id}` : undefined,
        },
        {
          key: 'architecture',
          label: t('model.sheet.rows.architecture'),
          value: architecture,
        },
        {
          key: 'aspiration',
          label: t('model.sheet.rows.aspiration'),
          value: engine
            ? t(`model.sheet.aspirations.${engine.aspiration}`)
            : null,
        },
        {
          key: 'displacement',
          label: t('model.displacement'),
          value: num(engine?.displacement_cc, 'cm³'),
        },
        {
          key: 'boreStroke',
          label: t('model.sheet.rows.boreStroke'),
          value:
            engine?.bore_mm != null && engine.stroke_mm != null
              ? `${formatNumber(engine.bore_mm, lang, 1)} × ${formatNumber(engine.stroke_mm, lang, 1)} mm`
              : null,
        },
        {
          key: 'valves',
          label: t('model.sheet.rows.valves'),
          value: num(engine?.valves_per_cylinder),
        },
        {
          key: 'icePower',
          label: t('model.sheet.rows.icePower'),
          value: num(powertrain?.combustion?.power_cv, 'cv'),
        },
        {
          key: 'iceTorque',
          label: t('model.sheet.rows.iceTorque'),
          value: num(powertrain?.combustion?.torque_nm, 'Nm'),
        },
        {
          key: 'maxRpm',
          label: t('model.sheet.rows.maxRpm'),
          value: num(powertrain?.combustion?.max_rpm, t('model.sheet.rpm')),
        },
        {
          key: 'consumption',
          label: t('model.sheet.rows.consumption'),
          value: num(
            powertrain?.combustion?.fuel_consumption_l100,
            'l/100 km',
            1,
          ),
        },
        {
          key: 'electricMotors',
          label: t('model.sheet.rows.electricMotors'),
          value: num(powertrain?.electric?.motors_count),
        },
        {
          key: 'electricPower',
          label: t('model.sheet.rows.electricPower'),
          value: num(powertrain?.electric?.power_cv, 'cv'),
        },
        {
          key: 'battery',
          label: t('model.sheet.rows.battery'),
          value: num(powertrain?.electric?.battery_kwh, 'kWh', 1),
        },
        {
          key: 'electricRange',
          label: t('model.sheet.rows.electricRange'),
          value: num(powertrain?.electric?.range_km, 'km'),
        },
        {
          key: 'systemPower',
          label: t('model.sheet.rows.systemPower'),
          value: num(powertrain?.system.power_cv, 'cv'),
        },
        {
          key: 'systemTorque',
          label: t('model.sheet.rows.systemTorque'),
          value: num(powertrain?.system.torque_nm, 'Nm'),
        },
        {
          key: 'gearbox',
          label: t('model.sheet.rows.gearbox'),
          value: gearbox,
        },
        {
          key: 'drivetrain',
          label: t('model.sheet.rows.drivetrain'),
          value: transmission?.drivetrain
            ? t(`model.sheet.drivetrains.${transmission.drivetrain}`)
            : null,
        },
      ],
    },
    {
      key: 'performance',
      title: t('model.sheet.sections.performance'),
      rows: [
        {
          key: 'topSpeed',
          label: t('model.topSpeed'),
          value: num(specs?.performance.top_speed_kmh, 'km/h'),
        },
        {
          key: 'zeroTo100',
          label: t('model.acceleration'),
          value: num(specs?.performance.zero_to_100_sec, 's', 2),
        },
        {
          key: 'zeroTo200',
          label: t('model.sheet.rows.zeroTo200'),
          value: num(specs?.performance.zero_to_200_sec, 's', 1),
        },
        {
          key: 'fiorano',
          label: t('model.sheet.rows.fiorano'),
          value:
            specs?.performance.fiorano_lap_sec != null
              ? formatLap(specs.performance.fiorano_lap_sec, lang)
              : null,
        },
      ],
    },
    {
      key: 'dimensions',
      title: t('model.sheet.sections.dimensions'),
      rows: [
        {
          key: 'length',
          label: t('model.sheet.rows.length'),
          value: num(specs?.dimensions.length_mm, 'mm'),
        },
        {
          key: 'width',
          label: t('model.sheet.rows.width'),
          value: num(specs?.dimensions.width_mm, 'mm'),
        },
        {
          key: 'height',
          label: t('model.sheet.rows.height'),
          value: num(specs?.dimensions.height_mm, 'mm'),
        },
        {
          key: 'wheelbase',
          label: t('model.sheet.rows.wheelbase'),
          value: num(specs?.dimensions.wheelbase_mm, 'mm'),
        },
        {
          key: 'dryWeight',
          label: t('model.dryWeight'),
          value: num(specs?.weight.dry_kg, 'kg'),
        },
        {
          key: 'frontDistribution',
          label: t('model.sheet.rows.frontDistribution'),
          value: num(specs?.weight.front_distribution_pct, '%'),
        },
      ],
    },
    {
      key: 'chassis',
      title: t('model.sheet.sections.chassis'),
      rows: [
        {
          key: 'chassisMaterial',
          label: t('model.sheet.rows.chassisMaterial'),
          value: specs?.chassis.material
            ? t(`model.sheet.chassisMaterials.${specs.chassis.material}`)
            : null,
        },
        {
          key: 'brakes',
          label: t('model.sheet.rows.brakes'),
          value: specs?.chassis.brakes
            ? t(`model.sheet.brakeTypes.${specs.chassis.brakes}`)
            : null,
        },
      ],
    },
    {
      key: 'body',
      title: t('model.sheet.sections.body'),
      rows: [
        {
          key: 'vehicleType',
          label: t('model.sheet.rows.vehicleType'),
          value: t(`model.sheet.vehicleTypes.${version.vehicle_type}`),
        },
        {
          key: 'bodyType',
          label: t('model.sheet.rows.bodyType'),
          value: version.body_type
            ? t(`model.sheet.bodyTypes.${version.body_type}`)
            : null,
        },
        {
          key: 'seats',
          label: t('model.sheet.rows.seats'),
          value: num(version.seats),
        },
        {
          key: 'projectCode',
          label: t('model.sheet.rows.projectCode'),
          value: version.project_code,
        },
        {
          key: 'production',
          label: t('model.production'),
          value: productionValue,
        },
        { key: 'years', label: t('model.sheet.rows.years'), value: yearsValue },
      ],
    },
  ]

  // Via le righe senza dato, poi via le sezioni rimaste vuote
  const filled = sections
    .map((section) => ({
      ...section,
      rows: section.rows.filter((row) => row.value !== null),
    }))
    .filter((section) => section.rows.length > 0)

  return (
    <section aria-labelledby="scheda-titolo" className="border-linea border-t">
      <div className="mx-auto max-w-[1360px] px-5 py-18 md:px-10 md:py-24">
        <h2
          id="scheda-titolo"
          className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs"
        >
          {t('model.sheet.title')}
        </h2>

        <div className="mt-8 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {filled.map((section) => (
            <div key={section.key}>
              <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] md:text-2xl">
                {section.title}
              </h3>
              <dl className="border-linea mt-4 border-t">
                {section.rows.map((row) => (
                  <div
                    key={row.key}
                    className="border-linea flex items-baseline justify-between gap-6 border-b py-3"
                  >
                    <dt className="text-sm text-neutral-400">{row.label}</dt>
                    <dd className="text-right text-sm font-medium text-neutral-100 tabular-nums">
                      {row.to ? (
                        <Link
                          to={row.to}
                          className="hover:decoration-rosso-acceso underline decoration-neutral-600 underline-offset-4 hover:text-white"
                        >
                          {row.value}
                        </Link>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
