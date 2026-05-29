# Cornell Notes

## Topic: Light and the Electromagnetic Spectrum

## Date: 29/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- First question or keyword
- Second question or keyword
- Third question or keyword

---

### Notes Section (Main Notes)

The sources define **Light and the Electromagnetic Spectrum** as a fundamental topic within **Chapter 2: Digital Image Fundamentals**, providing essential background for understanding how images are formed, sensed, and processed digitally.

Here's a detailed discussion based on the provided information:

**1. Nature of the Electromagnetic (EM) Spectrum**
*   The electromagnetic spectrum encompasses a wide range of energy.
*   It can be conceptualized as **propagating sinusoidal waves of varying wavelengths** or as a **stream of massless particles (photons)**, each traveling in a wavelike pattern at the speed of light.
*   Each photon contains a certain amount of energy.
*   The spectrum is arranged according to **energy per photon**, ranging from **gamma rays (highest energy)** to **radio waves (lowest energy)**.
*   Bands of the EM spectrum are not distinct but transition smoothly from one to the other.
*   The electromagnetic spectrum can be expressed in terms of **wavelength ($\lambda$)**, **frequency ($\nu$)**, or **energy (E)**.
    *   Wavelength and frequency are related by the expression $\lambda\nu = c$, where $c$ is the speed of light ($2.998 \times 10^8$ m/s).
    *   The energy of various components is given by $E = h\nu$, where $h$ is Planck's constant. This means **higher-frequency (shorter wavelength) electromagnetic phenomena carry more energy per photon**.
*   Common units: wavelength in meters (or microns ($\mu$m = $10^{-6}$ m) and nanometers (nm = $10^{-9}$ m)), frequency in Hertz (Hz), and energy in electron-volts.

**2. Visible Light – A Small Portion of the Spectrum**
*   **Light** is a specific type of electromagnetic radiation that the human eye can sense.
*   The **visible spectrum** is a very small portion of the overall electromagnetic spectrum, spanning approximately **0.43 $\mu$m (violet) to 0.79 $\mu$m (red)**.
*   This visible band is divided into six broad regions: **violet, blue, green, yellow, orange, and red**.
*   The colors perceived in an object are determined by the **nature of the light reflected from it**.
    *   A body reflecting light balanced in all visible wavelengths appears **white**.
    *   A body favoring reflectance in a limited range of the visible spectrum exhibits specific **shades of color** (e.g., green objects reflect light primarily in the 500 to 570 nm range).

**3. Characteristics of Light and Color**
*   **Monochromatic (or achromatic) light** is void of color, and its only attribute is its **intensity** or amount. This intensity is perceived as varying from black to grays to white, and the term **gray level** is commonly used to denote monochromatic intensity. The range from black to white is called the **gray scale**, and monochromatic images are often referred to as **gray-scale images**.
*   **Chromatic (color) light** spans from approximately 0.43 to 0.79 $\mu$m.
*   Three basic quantities describe a chromatic light source:
    *   **Radiance**: The total amount of energy flowing from the light source, typically measured in watts (W).
    *   **Luminance**: A measure of the amount of energy an observer *perceives* from a light source, measured in lumens (lm). For example, infrared light can have high radiance but nearly zero luminance for a human observer.
    *   **Brightness**: A **subjective descriptor** of light perception that is practically impossible to measure. It embodies the achromatic notion of intensity and is a key factor in describing color sensation.

**4. Other Bands of the EM Spectrum and Their Applications**
*   **Gamma rays**: Used in nuclear medicine, astronomical observations, and imaging radiation in nuclear environments.
*   **X-rays**: Oldest source of EM radiation for imaging. Widely used in medical diagnostics (e.g., chest X-rays, CT scans) and industrial applications (e.g., inspecting circuit boards). Hard (high-energy) X-rays for industrial use, soft (lower energy) X-rays for medical.
*   **Ultraviolet (UV) band**: Applications include lithography, industrial inspection, microscopy (e.g., fluorescence microscopy), lasers, biological imaging, and astronomical observations.
*   **Infrared (IR) band**: Often used with visual imaging. Radiates heat, making it useful in imaging applications that rely on "heat signatures" (e.g., remote sensing, satellite images). Near-infrared is close to the visible spectrum, while far-infrared blends with the microwave band.
*   **Microwave band**: Known for microwave ovens, but also used in communications, radar (e.g., spaceborne radar imaging), and satellite imagery.
*   **Radio band**: Major applications in medicine (e.g., Magnetic Resonance Imaging - MRI) and astronomy.

**5. Imaging Modalities Beyond the EM Spectrum**
*   While imaging predominantly relies on electromagnetic waves, other methods exist:
    *   **Acoustic imaging**: Uses sound reflected from objects (e.g., ultrasonic images, medical ultrasound of babies or organs).
    *   **Electron beams**: Used in electron microscopy for very high magnification (e.g., Scanning Electron Microscope - SEM images of material failures).
    *   **Synthetic (computer-generated) images**: Fractals and 3D computer models used for visualization and modeling.

**6. Wavelength and Object Visibility**
*   A crucial principle is that **the wavelength of an electromagnetic wave required to "see" an object must be of the same size as or smaller than the object**. This physical limitation, along with sensor material properties, dictates the capabilities of imaging sensors. For instance, studying molecules with diameters around $10^{-10}$ m requires sources in the far ultraviolet or soft X-ray regions.

**Context within Chapter 2: Digital Image Fundamentals**
This detailed understanding of light and the electromagnetic spectrum (Section 2.2) is foundational for Digital Image Fundamentals because:
*   It directly informs **Section 2.1: Elements of Visual Perception** by explaining the physical nature of the "light" that the human eye (and its rods and cones) senses and processes, and how human vision perceives different wavelengths as color.
*   It is critical for **Section 2.3: Image Sensing and Acquisition** by defining the various energy sources and their characteristics that physical devices are designed to detect and convert into digital signals. The choice of sensor (e.g., CCD arrays) is determined by the specific band of the EM spectrum being imaged.
*   It influences decisions in **Section 2.4: Image Sampling and Quantization**, particularly regarding the intensity resolution. The perception of gray levels and colors by the human visual system, as discussed, is a key consideration in preventing artifacts like false contouring when quantizing image data.
*   It underpins the **Image Formation Model** (Section 2.3.4), where images are characterized by illumination (often from an EM source) and reflectance properties of objects. This model is used later for techniques like homomorphic filtering in Chapter 4.
*   This knowledge is essential for understanding **later chapters**, such as Color Image Processing (Chapter 6), which delves deeper into color models and how humans perceive color, and Filtering in the Frequency Domain (Chapter 4), where concepts like white noise relate to constant Fourier spectra, analogous to white light containing all visible frequencies.

---

### Summary Section (Summary of Notes)

Brief summary of key ideas and takeaways