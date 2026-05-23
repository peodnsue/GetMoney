import React from 'react';
import styled from 'styled-components';

interface IdentityCardProps {
  nickname: string;
  gcoinBalance: string | number;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ nickname, gcoinBalance }) => {
  const gcoinValue = typeof gcoinBalance === 'string' ? parseFloat(gcoinBalance) : gcoinBalance;
  const gcoinMod = Math.floor(gcoinValue) % 101;
  const hpValue = gcoinMod;
  const damage1 = (Math.floor(gcoinValue) * 43 + 27) % 101;
  const damage2 = (Math.floor(gcoinValue) * 73 + 61) % 101;

  return (
    <StyledWrapper>
      <div className="card-container">
        <div className="hover-zone tl" />
        <div className="hover-zone tr" />
        <div className="hover-zone bl" />
        <div className="hover-zone br" />
        <div className="playing-card">
          <div className="shimmer" />
          <div className="card-inner-content">
            <div className="card-header">
              <div className="header-left">
                <span className="stage-label">Basic Pokémon</span>
                <span className="pokemon-name">{nickname}</span>
              </div>
              <div className="header-right">
                <span className="hp-label">HP</span>{hpValue}
                <div className="type-icon-header">
                  <svg className="icon-svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="art-box">
              <div className="bg-clipper">
                <div className="parallax-layer layer-sky" />
                <div className="parallax-layer layer-grass">
                  <div className="grass-shape" />
                </div>
              </div>
              <div className="parallax-layer layer-pokemon">
                <svg className="main-svg-image" height="150px" width="200px" version="1.1" id="_x36_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000">
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <g>
                        <path style={{fill: '#ECE1D4'}} d="M302.324,473.485h-60.715V512h60.715c10.628,0,19.258-8.618,19.258-19.251 C321.582,482.121,312.952,473.485,302.324,473.485z" />
                        <path style={{fill: '#F8EDE2'}} d="M199.625,473.485c-10.622,0-19.251,8.636-19.251,19.263c0,10.634,8.63,19.251,19.251,19.251h41.984 v-38.515H199.625z" />
                      </g>
                      <path style={{fill: '#F8DBC0'}} d="M183.806,86.173c-35.953,0-71.888-42.786-58.198-75.307c5.129-11.961-1.713-15.393-15.409-3.413 c-13.684,11.993-39.373,82.152,44.508,119.803L183.806,86.173z" />
                      <path style={{fill: '#6F6254'}} d="M19.484,110.571c12.844-3.426,63.33-8.567,102.69,13.696c10.787,6.1,16.261,8.574,25.68-0.864 c15.424-15.418,0.614,76.171-6.855,76.171c-10.268,0-35.934,0-54.76,0c-29.101,0-56.196-15.819-68.478-30.805 C2.359,149.938-13.758,119.433,19.484,110.571z" />
                      <g>
                        <path style={{fill: '#6F6254'}} d="M183.756,77.962c-0.301,0-0.739,0-1.04,0c-17.447,0-23.798,7.941-30.145,22.213 c-6.338,14.266-24.233,71.161-28.557,80.874c-6.344,14.285-6.319,30.148-6.319,50.764c0,20.623,0,100.571,0,124.361 c0,10.427,6.717,21.756,17.326,32.265c2.135,2.129,4.402,4.215,6.679,6.25C277.055,257.108,215.056,116.276,183.756,77.962z" />
                        <path style={{fill: '#FFFDF9'}} d="M183.756,77.962c31.3,38.314,93.299,179.146-42.056,316.728 c12.215,10.935,25.147,20.516,25.147,26.528c0,12.688-6.331,22.207-6.331,39.648c0,17.447,15.581,29.434,43.7,29.434 c14.279,0,56.232,0,56.232,0V77.962C241.728,77.962,201.711,77.962,183.756,77.962z" />
                      </g>
                      <g>
                        <path style={{fill: '#EFCDAE'}} d="M318.244,86.173c35.947,0,71.894-42.786,58.191-75.307c-5.142-11.961,1.716-15.393,15.4-3.413 c13.702,11.993,39.372,82.152-44.489,119.803L318.244,86.173z" />
                        <path style={{fill: '#8B7B67'}} d="M371.964,238.684c0.645,1.835,1.052,3.758,1.052,5.812c0,9.92-8.054,17.986-17.974,17.986 c-9.932,0-17.98-8.066-17.98-17.986c0-0.419,0.107-0.827,0.138-1.234C350.177,232.484,363.322,236.054,371.964,238.684z" />
                        <g>
                          <path style={{fill: '#F8EDE2'}} d="M356.828,119.802c-2.975-8.517-5.618-15.706-7.365-19.627 c-6.343-14.272-12.681-22.213-30.122-22.213c-17.467,0-58.693,0-77.731,0V490.3c0,0,41.94,0,56.219,0 c28.125,0,43.706-11.987,43.706-29.434c0-14.022-4.052-22.939-5.661-32.484C227.731,285.878,306.495,145.673,356.828,119.802z" />
                          <path style={{fill: '#625549'}} d="M367.029,388.44c10.602-10.509,17.328-21.838,17.328-32.265c0-23.791,0-103.738,0-124.361 c0-20.616,0.019-36.479-6.325-50.764c-3.131-7.039-13.389-38.833-21.205-61.248c-50.332,25.871-129.096,166.076-20.955,308.58 c-0.401-2.323-0.676-4.672-0.676-7.164C335.197,414.079,353.427,401.942,367.029,388.44z" />
                        </g>
                      </g>
                      <path style={{fill: '#8B7B67'}} d="M46.867,161.918c-5.997-5.993-8.555-23.973,6.848-22.238c15.409,1.69,54.772,17.097,54.772,23.947 C108.487,170.479,77.127,192.185,46.867,161.918z" />
                      <path style={{fill: '#625549'}} d="M489.437,110.571c-12.851-3.426-63.34-8.567-102.705,13.696c-10.778,6.1-16.264,8.574-25.677-0.864 c-15.431-15.418-0.607,76.171,6.864,76.171c10.258,0,35.922,0,54.747,0c29.102,0,56.206-15.819,68.481-30.805 C506.552,149.938,522.659,119.433,489.437,110.571z" />
                      <path style={{fill: '#8B7B67'}} d="M462.031,161.918c6.006-5.993,8.561-23.973-6.839-22.238c-15.406,1.69-54.772,17.097-54.772,23.947 C400.421,170.479,431.79,192.185,462.031,161.918z" />
                      <g>
                        <path style={{fill: '#342928'}} d="M130.077,238.684c-0.633,1.835-1.049,3.758-1.049,5.812c0,9.92,8.051,17.986,17.98,17.986 c9.917,0,17.967-8.066,17.967-17.986c0-0.419-0.088-0.827-0.132-1.234C151.867,232.484,138.719,236.054,130.077,238.684z" />
                        <path style={{fill: '#342928'}} d="M371.964,238.684c0.645,1.835,1.052,3.758,1.052,5.812c0,9.92-8.054,17.986-17.974,17.986 c-9.932,0-17.98-8.066-17.98-17.986c0-0.419,0.107-0.827,0.138-1.234C350.177,232.484,363.322,236.054,371.964,238.684z" />
                      </g>
                      <g>
                        <path style={{fill: '#4F4B4A'}} d="M204.147,431.407c15.725-6.056,18.63,30.649,10.101,33.686 C198.517,470.711,189.542,437.012,204.147,431.407z" />
                        <path style={{fill: '#4F4B4A'}} d="M292.442,431.407c-15.731-6.056-18.643,30.649-10.107,33.686 C298.06,470.711,307.052,437.012,292.442,431.407z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
            <div className="info-strip">Cow Pokémon. Length: 5'02", Weight: 450 lbs.</div>
            <div className="attacks-container">
              <div className="attack-row">
                <div className="energy-cost">
                  <div className="energy-orb colorless">
                    <svg className="icon-svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                </div>
                <div className="attack-mid">
                  <div className="attack-name">Headbutt</div>
                </div>
                <div className="attack-damage">{damage1}</div>
              </div>
              <div className="attack-row">
                <div className="energy-cost">
                  <div className="energy-orb colorless">
                    <svg className="icon-svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                  <div className="energy-orb colorless">
                    <svg className="icon-svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                  <div className="energy-orb colorless">
                    <svg className="icon-svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                </div>
                <div className="attack-mid">
                  <div className="attack-name">Stampede</div>
                  <div className="attack-desc">
                    Flip a coin. If tails, this Pokémon does 20 damage to itself.
                  </div>
                </div>
                <div className="attack-damage">{damage2}</div>
              </div>
            </div>
            <div className="footer-stats">
              <div className="stat-box">
                <span>Weakness</span>
                <div className="energy-orb fighting">
                  <svg className="icon-svg" viewBox="0 0 24 24">
                    <path d="M23 10h-3V7c0-1.1-.9-2-2-2s-2 .9-2 2v3h-1V5c0-1.1-.9-2-2-2s-2 .9-2 2v5h-1V7c0-1.1-.9-2-2-2s-2 .9-2 2v3H3c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2z" />
                  </svg>
                </div>
                <span>×2</span>
              </div>
              <div className="stat-box">
                <span>Resistance</span>
              </div>
              <div className="stat-box">
                <span>Retreat Cost</span>
                <div className="energy-orb colorless">
                  <svg className="icon-svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <div className="energy-orb colorless">
                  <svg className="icon-svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <div className="energy-orb colorless">
                  <svg className="icon-svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bottom-metadata">
              <div className="illustrator">
                Illus. The User • {(gcoinMod+damage1+damage2)/3}/100
                <svg className="icon-svg star-svg" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <svg className="pokemon-logo-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0 24px 0;

  .icon-svg {
    width: 1em;
    height: 1em;
    display: inline-block;
    vertical-align: middle;
    fill: currentColor;
  }

  .card-container {
    position: relative;
    width: 345px;
    height: 480px;
    perspective: 1500px;
  }

  .hover-zone {
    position: absolute;
    width: 50%;
    height: 50%;
    z-index: 20;
  }
  .hover-zone.tl {
    top: 0;
    left: 0;
  }
  .hover-zone.tr {
    top: 0;
    right: 0;
  }
  .hover-zone.bl {
    bottom: 0;
    left: 0;
  }
  .hover-zone.br {
    bottom: 0;
    right: 0;
  }

  .playing-card {
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom right, #ffe76b, #cba922);
    border-radius: 18px;
    position: relative;
    padding: 12px;
    transform-style: preserve-3d;
    transition:
      transform 0.4s ease-out,
      box-shadow 0.4s ease-out;
    box-shadow:
      0 10px 20px rgba(0, 0, 0, 0.4),
      inset 0 0 0 2px rgba(255, 255, 255, 0.3);
  }

  .card-inner-content {
    background: radial-gradient(circle at center, #f4d742 20%, #f8d030 80%);
    height: 100%;
    width: 100%;
    border-radius: 6px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    color: #4a3a2f;
    position: relative;
    z-index: 2;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
    transform-style: preserve-3d;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 6px 10px 2px 10px;
  }

  .header-left {
    display: flex;
    flex-direction: column;
  }

  .pokemon-name {
    font-weight: 800;
    font-size: 1.4rem;
    letter-spacing: -0.5px;
    line-height: 1;
  }

  .stage-label {
    font-size: 0.6rem;
    font-weight: bold;
    color: rgba(74, 58, 47, 0.7);
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 800;
    font-size: 1.3rem;
    color: #d32f2f;
  }

  .hp-label {
    font-size: 0.6rem;
    margin-right: 2px;
    color: #d32f2f;
  }

  .type-icon-header {
    width: 24px;
    height: 24px;
    background: #f8d030;
    border-radius: 50%;
    border: 1px solid #a38513;
    box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.8);
    display: grid;
    place-items: center;
    font-size: 14px;
    color: #4a3a2f;
  }

  .art-box {
    margin: 2px 10px;
    height: 160px;
    border: 3px solid #a68e59;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    background: transparent;
    transform-style: preserve-3d;
    transform: translateZ(0px);
  }

  .bg-clipper {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 0;
  }

  .parallax-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .layer-sky {
    background: linear-gradient(to bottom, #5ca0d3, #c1e3ff);
    transform: scale(1.2);
  }

  .layer-grass {
    transform: translateZ(0);
  }

  .grass-shape {
    position: absolute;
    bottom: -30px;
    left: -10%;
    width: 120%;
    height: 70px;
    background: linear-gradient(to top, #388e3c, #6abf69);
    border-radius: 50% 50% 0 0;
    box-shadow: inset 0 5px 10px rgba(0, 0, 0, 0.1);
  }

  .layer-pokemon {
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateZ(50px);
    z-index: 2;
    filter: drop-shadow(0 25px 15px rgba(0, 0, 0, 0.5));
  }

  .main-svg-image {
    width: 75%;
    height: auto;
  }

  .info-strip {
    background: linear-gradient(to right, #cba922, #e6cd6b, #cba922);
    margin: 4px 8px;
    padding: 2px 5px;
    font-size: 0.6rem;
    font-style: italic;
    text-align: center;
    border-radius: 2px;
    border-top: 1px solid rgba(255, 255, 255, 0.4);
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }

  .attacks-container {
    flex-grow: 1;
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
  }

  .attack-row {
    display: flex;
    align-items: center;
  }

  .energy-cost {
    display: flex;
    gap: 2px;
    width: 50px;
  }

  .energy-orb {
    width: 18px;
    height: 18px;
    background: #f8d030;
    border-radius: 50%;
    border: 1px solid #a38513;
    box-shadow: inset 0 2px 3px rgba(255, 255, 255, 0.9);
    display: grid;
    place-items: center;
    font-size: 10px;
    color: #4a3a2f;
  }

  .energy-orb.colorless {
    background: #e0e0e0;
    border: 1px solid #a0a0a0;
  }

  .energy-orb.fighting {
    background: #c07a50;
    border-color: #8b4513;
    color: white;
  }

  .attack-mid {
    flex-grow: 1;
    padding: 0 10px;
  }

  .attack-name {
    font-weight: 800;
    font-size: 1rem;
  }

  .attack-desc {
    font-size: 0.65rem;
    line-height: 1.1;
    margin-top: 2px;
    color: rgba(74, 58, 47, 0.9);
  }

  .attack-damage {
    font-weight: 800;
    font-size: 1.3rem;
  }

  .footer-stats {
    display: flex;
    justify-content: space-between;
    padding: 5px 15px;
    background: rgba(0, 0, 0, 0.05);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 0.7rem;
    font-weight: bold;
  }

  .stat-box {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .bottom-metadata {
    padding: 4px 10px 8px 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 0.55rem;
    font-weight: bold;
    color: #4a3a2f;
  }

  .star-svg {
    fill: #4a3a2f;
    margin-left: 2px;
  }

  .pokemon-logo-svg {
    height: 16px;
    width: auto;
    fill: #ffcb05;
    stroke: #3c5aa6;
    stroke-width: 1px;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
  }

  .shimmer {
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    opacity: 0.3;
    background: linear-gradient(
        115deg,
        transparent 20%,
        rgba(255, 0, 0, 0.4) 30%,
        rgba(255, 255, 0, 0.4) 40%,
        rgba(0, 255, 0, 0.4) 50%,
        rgba(0, 255, 255, 0.4) 60%,
        rgba(0, 0, 255, 0.4) 70%,
        rgba(255, 0, 255, 0.4) 80%,
        transparent 90%
      ),
      radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px);
    background-size:
      200% 200%,
      3px 3px;
    background-position: 0% 0%;
    mix-blend-mode: color-dodge;
    border-radius: 18px;
    transition:
      background-position 0.4s ease,
      opacity 0.4s ease;
  }

  .hover-zone.tl:hover ~ .playing-card {
    transform: rotateX(15deg) rotateY(-18deg);
  }
  .hover-zone.tr:hover ~ .playing-card {
    transform: rotateX(15deg) rotateY(18deg);
  }
  .hover-zone.bl:hover ~ .playing-card {
    transform: rotateX(-15deg) rotateY(-18deg);
  }
  .hover-zone.br:hover ~ .playing-card {
    transform: rotateX(-15deg) rotateY(18deg);
  }

  .hover-zone.tl:hover ~ .playing-card .shimmer {
    background-position: 0% 0%;
    opacity: 0.7;
  }
  .hover-zone.tr:hover ~ .playing-card .shimmer {
    background-position: 100% 0%;
    opacity: 0.7;
  }
  .hover-zone.bl:hover ~ .playing-card .shimmer {
    background-position: 0% 100%;
    opacity: 0.7;
  }
  .hover-zone.br:hover ~ .playing-card .shimmer {
    background-position: 100% 100%;
    opacity: 0.7;
  }

  .hover-zone:hover ~ .playing-card {
    box-shadow:
      0 35px 60px rgba(0, 0, 0, 0.6),
      inset 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
`;

export default IdentityCard;
